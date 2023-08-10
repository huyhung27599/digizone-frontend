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

  cartItems: any;
  cartDispatch: (action: {
    type: string;
    payload: Record<string, any>;
  }) => void;
};

const initialContext: Context = {
  state: initialState,
  dispatch: () => {},
  cartItems: [],
  cartDispatch: function (action: {
    type: string;
    payload: Record<string, any>;
  }): void {
    throw new Error("Function not implemented");
  },
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

const cartReducer = (
  state: any,
  action: { type: string; payload: Record<string, any> | undefined }
) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const cartItems = [...state, action.payload];
      window.localStorage.setItem("_digi_cart", JSON.stringify(cartItems));
      return cartItems;
    case "REMOVE_FROM_CART":
      const newCartItems = state.filter(
        (item: { skuId: string }) => item.skuId! == action.payload?.skuId
      );
      window.localStorage.setItem("_digi_cart", JSON.stringify(newCartItems));
      return newCartItems;
    case "UPDATE_CART":
      const updatedCartItems = state.map((item: any) => {
        if (item.skuId === action.payload?.skuId) {
          return action.payload;
        }
        return item;
      });
      window.localStorage.setItem(
        "_digi_cart",
        JSON.stringify(updatedCartItems)
      );
      return updatedCartItems;
    case "GET_CART_ITEMS":
      return action.payload;
    case "CLEAR_CART":
      // clear cart from localStorage
      window.localStorage.removeItem("_digi_cart");
      return [];
    default:
      return state;
  }
};

const Provider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  const [cartItems, cartDispatch] = useReducer(cartReducer, []);

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
    <Context.Provider value={{ state, dispatch, cartItems, cartDispatch }}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
