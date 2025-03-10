import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "../PersonalExpensesModel.translate";
import { useCreateUserSpendingModelMutation } from "@/services/userSpendingModel";
import { useGetSpendingModelQuery } from "@/services/spendingModel";

const usePersonalExpensesModel = () => {
  const CUSTOM_MODEL = "Tùy chọn";
  const [customModel, setCustomModel] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [crateSpendingModel] = useCreateUserSpendingModelMutation();
  const { data, isLoading: isLoadingSpendingModel } = useGetSpendingModelQuery(
    {},
  );
  const [selectedModel, setSelectedModel] = useState("");

  let spendingModels = data?.items ?? [];
  let selectedModelName =
    spendingModels.find((model) => model.id === selectedModel)?.name ||
    "Tùy chọn";

  const customOption = { id: "custom", name: CUSTOM_MODEL };
  spendingModels = [...spendingModels, customOption as any];

  useHideTabbar();
  const [selectedTime, setSelectedTime] = useState("1 tháng");
  const [startDate, setStartDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  useEffect(() => {
    if (spendingModels.length > 0 && !selectedModel) {
      setSelectedModel(spendingModels[0].id);
    }
  }, [spendingModels, selectedModel]);

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
      return;
    }
    if (newStep === 3 && step !== 2) {
      return;
    }
    if (newStep < step && step === 3 && newStep !== 1 && newStep !== 2) {
      return;
    }

    if (selectedModel === customOption.id && !customModel.trim()) {
      ToastAndroid.show(
        TEXT_TRANSLATE_PERSONAL_EXPENSES.MESSAGE_VALIDATE.CUSTOM_MODEL_REQUIRED,
        ToastAndroid.SHORT,
      );
      return;
    }
    setStep(newStep);
  };

  const handleCreateSpendingModel = useCallback(async () => {
    const payload = {
      spendingModelId: selectedModel,
      periodUnit: selectedTime,
      periodValue: selectedTime,
      startDate,
    };
    console.log("chjeck handleCreateSpendingModel", payload);
    try {
      // const res = await crateSpendingModel(payload).unwrap();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return {
    state: {
      selectedModel,
      selectedTime,
      startDate,
      customModel,
      isModalVisible,
      step,
      spendingModels,
      isLoadingSpendingModel,
      selectedModelName,
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
      handleCreateSpendingModel,
    },
  };
};

export default usePersonalExpensesModel;
