import useHideTabbar from "@/hooks/useHideTabbar";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

const usePersonalExpensesModel = () => {
  const [selectedModel, setSelectedModel] = useState("80-20");
  const [customModel, setCustomModel] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  useHideTabbar();

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setHiddenTabbar(false));
  }, []);

  return {
    state: {
      selectedModel,
      customModel,
      isModalVisible,
      step,
    },
    handler: {
      setSelectedModel,
      setCustomModel,
      setIsModalVisible,
      setStep,
      handleBack,
    },
  };
};
export default usePersonalExpensesModel;
