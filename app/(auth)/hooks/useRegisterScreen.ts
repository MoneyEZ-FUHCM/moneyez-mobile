import { useState } from "react";

const useRegisterScreen = () => {
  const [data, setData] = useState();
  return {
    state: {
      data,
    },
    handler: {
      setData,
    },
  };
};

export default useRegisterScreen;
