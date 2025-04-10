import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetSpendingModelQuery } from "@/services/spendingModel";
import { useCreateUserSpendingModelMutation } from "@/services/userSpendingModel";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import PERSONAL_EXPENSES_MODEL_CONSTANTS, {
  PeriodUnit,
  TIME_OPTIONS,
} from "../PersonalExpensesModel.constants";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "../PersonalExpensesModel.translate";

interface TimeOption {
  label: string;
  unit: PeriodUnit;
  value: number;
}

const usePersonalExpensesModel = () => {
  const [customModel, setCustomModel] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [crateSpendingModel] = useCreateUserSpendingModelMutation();
  const { data, isLoading: isLoadingSpendingModel } = useGetSpendingModelQuery(
    {},
  );
  const [selectedModel, setSelectedModel] = useState("");
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  let spendingModels = data?.items ?? [];
  let selectedModelName =
    spendingModels.find((model) => model?.id === selectedModel)?.name ||
    "Tùy chọn";

  const { MESSAGE_ERROR } = TEXT_TRANSLATE_PERSONAL_EXPENSES;
  const { ERROR_CODE } = PERSONAL_EXPENSES_MODEL_CONSTANTS;

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  const [selectedTime, setSelectedTime] = useState<TimeOption>(TIME_OPTIONS[1]);
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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

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

    // if (selectedModel === customOption.id && !customModel.trim()) {
    //   ToastAndroid.show(
    //     TEXT_TRANSLATE_PERSONAL_EXPENSES.MESSAGE_VALIDATE.CUSTOM_MODEL_REQUIRED,
    //     ToastAndroid.SHORT,
    //   );
    //   return;
    // }
    setStep(newStep);
  };

  const handleCreateSpendingModel = useCallback(async () => {
    const payload = {
      spendingModelId: selectedModel,
      periodUnit: selectedTime.unit,
      periodValue: selectedTime.value,
      startDate,
    };

    try {
      const res = await crateSpendingModel(payload).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
        router.replace(PATH_NAME.HOME.INDIVIDUAL_HOME as any);
        ToastAndroid.show(
          "Tạo mô hình chi tiêu thành công",
          ToastAndroid.SHORT,
        );
      }
    } catch (err: any) {
      const error = err.data;

      if (error && error.errorCode === ERROR_CODE.ALREADY_HAS_ACTIVE_MODEL) {
        ToastAndroid.show(
          MESSAGE_ERROR.ALREADY_HAS_ACTIVE_MODEL,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, [selectedModel, selectedTime, startDate]);

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
