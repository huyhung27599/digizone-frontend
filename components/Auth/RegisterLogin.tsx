import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { Users } from "../../services/user.service";
import { useToasts } from "react-toast-notifications";
import { responsePayload, resposnePayload } from "../../services/api";
import validator from "validator";
import Router from "next/router";
import { Context } from "../../context";

interface IRegisterLoginProps {
  isRegisterForm?: boolean;
}

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

const RegisterLogin: FC<IRegisterLoginProps> = ({ isRegisterForm }) => {
  const { addToast } = useToasts();
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const [authForm, setAuthForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForgotPwd, setIsLoadingForgotPwd] = useState(false);
  const [otpTime, setOtpTime] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: "", otp: "" });

  useEffect(() => {
    if (user && user.email) {
      Router.push("/my-account");
    }
  }, [user]);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const { confirmPassword, email, name, password } = authForm;
      if (!name) {
        throw new Error("Invalid name");
      }
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
      }

      if (password !== confirmPassword) {
        throw new Error("Password does not match");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      setIsLoading(true);
      const payload = {
        email,
        password,
        name,
      };

      const { success, message }: responsePayload = await Users.registerNewUser(
        payload
      );
      if (!success) throw new Error(message);
      setOtpForm({ ...otpForm, email });
      setOtpTime(true);
      addToast(message, { appearance: "success", autoDismiss: true });
    } catch (error: any) {
      if (error.response) {
        return addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const { email, password } = authForm;
      if (!email || !password) {
        throw new Error("Invalid email or password");
      }
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
      }
      if (password.length < 6) {
        throw new Error("Password is too short. Minimum 6 characters");
      }
      setIsLoading(true);
      const payload = {
        email,
        password,
      };

      const { success, message, result }: responsePayload =
        await Users.loginUser(payload);
      if (!success) throw new Error(message);

      dispatch({
        type: "LOGIN",
        payload: result?.user,
      });
      addToast(message, { appearance: "success", autoDismiss: true });

      Router.push("/");
    } catch (error: any) {
      if (error.response) {
        return addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const otpResend = async () => {
    try {
      const { email } = otpForm;
      if (!validator.isEmail(email)) {
        throw new Error("Invalid email");
      }
      setIsLoading(true);

      const { success, message }: responsePayload = await Users.resendOTP(
        email
      );
      if (!success) throw new Error(message);
      addToast(message, { appearance: "success", autoDismiss: true });
    } catch (error: any) {
      if (error.response) {
        return addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUser = async (e: any) => {
    e.preventDefault();
    try {
      if (!validator.isEmail(otpForm.email)) {
        throw new Error("Invalid email");
      }
      setIsLoading(true);
      const { success, message }: responsePayload = await Users.verifyOTP(
        otpForm.otp,
        otpForm.email
      );
      if (!success) throw new Error(message);
      addToast(message, { appearance: "success", autoDismiss: true });
      setAuthForm(initialForm);
    } catch (error: any) {
      if (error.response) {
        return addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };

  const forgotPassword = async (e: any) => {
    e.preventDefault();
    try {
      const { email } = authForm;
      if (!validator.isEmail(email)) {
        throw new Error(
          "Invalid email. Plese enter a valid email and we will send you a password for you"
        );
      }
      setIsLoadingForgotPwd(true);
      const { success, message }: responsePayload =
        await Users.forgotUserPassword(email);
      if (!success) throw new Error(message);
      addToast(message, { appearance: "success", autoDismiss: true });
    } catch (error: any) {
      if (error.response) {
        return addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      }
      addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoadingForgotPwd(false);
    }
  };

  return (
    <Card>
      <Card.Header>{isRegisterForm ? "Register" : "Login"}</Card.Header>
      <Card.Body>
        <Form>
          {isRegisterForm && (
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your full name"
                disabled={otpTime}
                value={authForm.name || ""}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              name="email"
              disabled={otpTime}
              value={authForm.email || ""}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              disabled={otpTime}
              value={authForm.password || ""}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
            />
          </Form.Group>
          {isRegisterForm && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Re-type password</Form.Label>
                <Form.Control
                  type="password"
                  name="repassword"
                  placeholder="Re-type your password"
                  disabled={otpTime}
                  value={authForm.confirmPassword || ""}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {otpTime && (
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    placeholder="OTP"
                    onChange={(e) =>
                      setOtpForm({ ...otpForm, otp: e.target.value })
                    }
                  />

                  <Button
                    variant="link"
                    className="resendOtpBtn"
                    onClick={otpResend}
                  >
                    Resend OTP
                  </Button>
                </Form.Group>
              )}
            </>
          )}
          {otpTime ? (
            <Form.Group className="mb-3">
              <Button
                variant="info"
                type="submit"
                className="btnAuth"
                disabled={isLoading}
                onClick={verifyUser}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
              </Button>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Button
                variant="info"
                type="submit"
                className="btnAuth"
                disabled={isLoading}
                onClick={isRegisterForm ? handleRegister : handleLogin}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {isRegisterForm ? "Register" : "Login"}
              </Button>
            </Form.Group>
          )}
        </Form>
        {!isRegisterForm && (
          <a
            style={{ textDecoration: "none" }}
            href=""
            onClick={forgotPassword}
          >
            {isLoadingForgotPwd && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Forgot your password?
          </a>
        )}
      </Card.Body>
    </Card>
  );
};

export default RegisterLogin;
