import { useState } from "react";

const useInputOtpScreen = () => {
  const [otp, setOtp] = useState("");

  return {
    state: {
      otp,
    },
    handler: {
      setOtp,
    },
  };
};

export default useInputOtpScreen;
