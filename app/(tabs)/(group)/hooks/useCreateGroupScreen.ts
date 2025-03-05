import { useState, useEffect, useCallback } from "react";
import { Keyboard, ToastAndroid } from "react-native";
import { router } from "expo-router";
import * as Yup from "yup";
import { PATH_NAME } from "@/helpers/constants/pathname";
import TEXT_TRANSLATE_CREATE_GROUP from "../create-group/CreateGroup.translate";
import { useDispatch } from "react-redux";
import { useCreateGroupMutation } from "@/services/group";
import { setLoading } from "@/redux/slices/loadingSlice";
import { COMMON_CONSTANT } from "@/helpers/constants/common";

const useCreateGroupScreen = () => {
  const { MESSAGE_VALIDATE, SUCCESS_MESSAGES } = TEXT_TRANSLATE_CREATE_GROUP;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const dispatch = useDispatch();
  const [createGroup] = useCreateGroupMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
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

    setErrors(errors);
    return valid;
  };

  const handleCreateGroup = useCallback(
    async (payload: CreateGroupPayload) => {
      dispatch(setLoading(true));
      console.log("payload", payload);
      const updatePayload = {
        ...payload,
        name: payload.groupName,
        accountBankId: "fa077922-5f22-4428-e6a5-08dd5a25399b",
        image:
          "https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-1/470179908_1868434833564631_8029761738812755776_n.jpg?stp=dst-jpg_s320x320_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeGvozjYw7Nx8cjmh5fvA_YJktlzzRd3ByOS2XPNF3cHI7jQ6qhUGfwIzdyrvKSpFsyOyNK29qATn6Gj4Q78OH_B&_nc_ohc=7PRN6c8nBCgQ7kNvgFkJjcJ&_nc_oc=Adg62PEUV5H8jtzS_mwmm6_P5NIFV2PWuOoEcceHgjTSGtMF-xQ-_nevw8i4M-PYO1IF4bnBK2tcD-N9jDWaLSHG&_nc_zt=24&_nc_ht=scontent.fsgn2-3.fna&_nc_gid=ABMvHGgMibx25_yjmnjrC_T&oh=00_AYC-dUeNyjKeZ2PJfj7r-eN5fXEppOwdJ05AEMn-4bXZ8w&oe=67CD1775",
      };

      try {
        const res = await createGroup(updatePayload).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            SUCCESS_MESSAGES.GROUP_CREATED_SUCCESSFULLY,
            ToastAndroid.SHORT,
          );
          router.navigate(PATH_NAME.GROUP.CREATE_GROUP_STEP_2 as any);
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [
      createGroup,
      dispatch,
      HTTP_STATUS.SUCCESS.CREATED,
      SYSTEM_ERROR.SERVER_ERROR,
    ],
  );

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
      validationSchema,
      handleCreateGroup,
    },
  };
};

export default useCreateGroupScreen;
