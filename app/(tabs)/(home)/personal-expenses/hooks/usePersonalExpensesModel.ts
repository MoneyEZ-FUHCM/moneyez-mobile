import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "../PersonalExpensesModel.translate";

const usePersonalExpensesModel = () => {
  const CUSTOM_MODEL = "Tùy chọn";
  const [selectedModel, setSelectedModel] = useState("80-20");
  const [customModel, setCustomModel] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  useHideTabbar();
  const [selectedTime, setSelectedTime] = useState("1 tháng");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  const validationSchema = Yup.object({
    startDate: Yup.string()
      .trim()
      .required(TEXT_TRANSLATE_PERSONAL_EXPENSES.EMPTY_VALIDATION),
  });

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, [dispatch]);

  const handleSetStep = (newStep: number) => {
    if (newStep === 3 && (!startDate || !selectedTime)) {
      // Prevent moving to step 3 if startDate or selectedTime is not set
      return;
    }
    if (newStep === 3 && step !== 2) {
      // Prevent jumping directly from step 1 to step 3
      return;
    }
    if (newStep < step && step === 3 && newStep !== 1 && newStep !== 2) {
      // Allow going back to step 1 and step 2 from step 3
      return;
    }

    if (selectedModel === CUSTOM_MODEL && !customModel.trim()) {
      ToastAndroid.show(
        TEXT_TRANSLATE_PERSONAL_EXPENSES.MESSAGE_VALIDATE.CUSTOM_MODEL_REQUIRED,
        ToastAndroid.SHORT,
      );
      return;
    }
    setStep(newStep);
  };

  return {
    state: {
      selectedModel,
      selectedTime,
      startDate,
      customModel,
      isModalVisible,
      step,
    },
    handler: {
      setSelectedModel,
      setCustomModel,
      setIsModalVisible,
      setStep: handleSetStep,
      handleBack,
      setSelectedTime,
      setStartDate,
      validationSchema,
    },
  };
};

export default usePersonalExpensesModel;
