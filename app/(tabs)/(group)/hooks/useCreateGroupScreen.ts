import { useState, useEffect } from "react";
import { Keyboard, Alert } from "react-native";
import { router } from "expo-router";
import * as Yup from "yup";
import { PATH_NAME } from "@/helpers/constants/pathname";
import TEXT_TRANSLATE_CREATE_GROUP from "../create-group/CreateGroup.translate";

const useCreateGroupScreen = () => {
  const { MESSAGE_VALIDATE } = TEXT_TRANSLATE_CREATE_GROUP;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [errors, setErrors] = useState({
    groupName: "",
    description: "",
    currentBalance: "",
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const validationSchema = Yup.object().shape({
    groupName: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.GROUP_NAME_REQUIRED),
    description: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED),
    currentBalance: Yup.string()
      .trim()
      .matches(/^\d+$/, MESSAGE_VALIDATE.CURRENT_BALANCE_INVALID)
      .required(MESSAGE_VALIDATE.CURRENT_BALANCE_REQUIRED),
  });

  const validateFields = () => {
    setErrors({ groupName: "", description: "", currentBalance: "" });
    let valid = true;
    let errors = { groupName: "", description: "", currentBalance: "" };

    // if (!groupName) {
    //   errors.groupName = MESSAGE_VALIDATE.GROUP_NAME_REQUIRED;
    //   valid = false;
    // }

    // if (!description) {
    //   errors.description = MESSAGE_VALIDATE.DESCRIPTION_REQUIRED;
    //   valid = false;
    // }

    // if (!currentBalance || isNaN(Number(currentBalance))) {
    //   errors.currentBalance = MESSAGE_VALIDATE.CURRENT_BALANCE_INVALID;
    //   valid = false;
    // }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      // Proceed with form submission
      router.replace(PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any);
    } else {
      Alert.alert("Lỗi", MESSAGE_VALIDATE.ALL_FIELDS_REQUIRED);
    }
  };

  return {
    state: {
      isKeyboardVisible,
      groupName,
      description,
      currentBalance,
      errors,
    },
    handler: {
      setGroupName,
      setDescription,
      setCurrentBalance,
      validateFields,
      handleSubmit,
      validationSchema,
    },
  };
};

export default useCreateGroupScreen;
