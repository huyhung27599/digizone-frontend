import requests, { responsePayload } from "./api";

export const Users = {
  getUser: async (): Promise<responsePayload> => {
    const getUserRes = await requests.get("/users/1");
    return getUserRes;
  },

  getUsers: async (): Promise<responsePayload> => {
    const getUsersRes = await requests.get("/users");
    return getUsersRes;
  },

  registerNewUser: async (user: {}): Promise<responsePayload> => {
    const registerNewUserRes = await requests.post("/users", {
      ...user,
      type: "customer",
    });
    return registerNewUserRes;
  },

  loginUser: async (user: any): Promise<responsePayload> => {
    const loginUserRes = await requests.post("/users/login", user);
    window.localStorage.setItem(
      "_digi_user",
      JSON.stringify(loginUserRes.result.user)
    );

    return loginUserRes;
  },

  updateUser: async (user: any, id: string): Promise<responsePayload> => {
    const updateUserRes = await requests.patch(
      `/users/update-name-password/${id}`,
      user
    );
    const userData = JSON.parse(
      window.localStorage.getItem("_digi_user") || ""
    );

    userData.name = user?.name;

    window.localStorage.setItem("_digi_user", JSON.stringify(userData));

    return updateUserRes;
  },

  forgotUserPassword: async (email: string): Promise<responsePayload> => {
    const forgotUserPasswordRes = await requests.get(
      `/users/forgot-password/${email}`
    );

    return forgotUserPasswordRes;
  },

  resendOTP: async (email: string): Promise<responsePayload> => {
    const resendOTPRes = await requests.get("/users/send-otp-mail" + email);
    return resendOTPRes;
  },

  verifyOTP: async (otp: string, email: string): Promise<responsePayload> => {
    const verifyOTPRes = await requests.get(
      `/users/verify-email/${otp}/${email}`
    );

    return verifyOTPRes;
  },

  logoutUser: async (): Promise<responsePayload> => {
    const logoutUserRes = await requests.put("/users/logout", {});
    window.localStorage.removeItem("_digi_user");
    return logoutUserRes;
  },
};
