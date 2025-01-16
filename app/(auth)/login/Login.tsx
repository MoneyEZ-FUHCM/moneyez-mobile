import { SafeAreaViewCustom } from "@/components";
import InputComponent from "@/components/InputComponent";
import { Formik } from "formik";
import React, { useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import HOME_SCREEN_CONSTANTS from "../AuthScreen.const";
import useLoginScreen from "../hooks/useLoginScreen";

const Login = () => {
  const { handler, state } = useLoginScreen();
  const { TITLE, BUTTON } = HOME_SCREEN_CONSTANTS;

  useEffect(() => {
    console.log("hih");
  }, []);

  const handleRegister = (values: { email: string; password: string }) => {
    console.log("hih");
    Alert.alert("hii");
    console.log("check values", values);
    handler.handleLogin(values);
  };

  return (
    <SafeAreaViewCustom rootClassName="justify-center items-centers">
      <Text style={styles.title}>Đăng nhập tài khoản</Text>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={handler.registerValidationSchema}
        onSubmit={handleRegister}
      >
        {({ handleSubmit }) => (
          <>
            <InputComponent
              name="email"
              label="Tài khoản"
              placeholder="Nhập tài khoản"
            />
            <InputComponent
              name="password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              isPrivate
              isRequired
            />
            <InputComponent
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              isPrivate
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Login;
