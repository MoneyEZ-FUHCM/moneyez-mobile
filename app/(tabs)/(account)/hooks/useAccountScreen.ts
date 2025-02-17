import { handleLogout } from "@/hooks/useLogout";

const useAccountScreen = () => {
  return {
    state: {},
    handler: {
      handleLogout,
    },
  };
};

export default useAccountScreen;
