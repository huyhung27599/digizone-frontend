import { useReducer, createContext, useEffect, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode;
};

const initialState = {
  user: null,
};

type Context = {
  state: Record<string, any>;
  dispatch: (action: {
    type: string;
    payload: Record<string, any> | undefined;
  }) => void;
};

const initialContext: Context = {
  state: initialState,
  dispatch: () => {},
};

const Context = createContext<Context>(initialContext);

const rootReducer = (
  state: Record<string, any>,
  action: { type: string; payload: Record<string, any> | any }
) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "LOGIN",
      payload: JSON.parse(window.localStorage.getItem("_digi_user") || "{}"),
    });
  });

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .put("/api/v1/users/logout")
            .then(() => {
              console.log("/401 error > logout");
              dispatch({
                type: "LOGOUT",
                payload: undefined,
              });
              localStorage.removeItem("_digi_user");
              router.push("/auth");
            })
            .catch((err) => {
              console.log("AXIOS INTERCEPTORS ERR", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        process.env.NEXT_PUBLIC_BASE_API_PREFIX + "/csrf-token"
      );
      const csrfToken = data.result;
      if (!csrfToken) {
        throw new Error("CSRF Token not found");
      }

      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
      console.log("CSRF Token", csrfToken, axios.defaults.headers);
    };
    getCsrfToken();
  }, []);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
