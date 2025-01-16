import { useState } from "react";
import * as Yup from "yup";
import axios from "axios";

const useLoginScreen = () => {
  const [data, setData] = useState(0);

  const registerValidationSchema = Yup.object({
    username: Yup.string()
      .required("Tài khoản không được để trống")
      .min(4, "Tài khoản phải có ít nhất 4 ký tự"),
    password: Yup.string()
      .required("Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa")
      .matches(/[0-9]/, "Mật khẩu phải có ít nhất một chữ số"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Xác nhận mật khẩu không khớp")
      .required("Xác nhận mật khẩu không được để trống"),
  });

  const handleLogin = async (payload: any) => {
    try {
      const res = await axios.post(
        "http://178.128.118.171:8080/api/v1/auth/login",
        payload,
      );
      console.log("check res", res);
    } catch (err: any) {
      console.log("err", err.response);
    }
  };

  return {
    state: {
      data,
    },
    handler: {
      setData,
      registerValidationSchema,
      handleLogin,
    },
  };
};

export default useLoginScreen;
