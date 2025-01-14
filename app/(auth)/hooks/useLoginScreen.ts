import { useState } from "react";

const useLoginScreen = () => {
  const [data, setData] = useState(0);
  return {
    state: {
      data,
    },
    handler: {
      setData,
    },
  };
};

export default useLoginScreen;
