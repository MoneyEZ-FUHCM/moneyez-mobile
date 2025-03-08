import { useState, useEffect, useCallback } from "react";
import { Keyboard, ToastAndroid } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Yup from "yup";
import { PATH_NAME } from "@/helpers/constants/pathname";
import TEXT_TRANSLATE_CREATE_GROUP from "../create-group/CreateGroup.translate";
import { useDispatch } from "react-redux";
import { useCreateGroupMutation } from "@/services/group";
import { setLoading } from "@/redux/slices/loadingSlice";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useUploadImage from "@/hooks/useUploadImage";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";

const useCreateGroupScreen = () => {
  const { MESSAGE_VALIDATE, SUCCESS_MESSAGES } = TEXT_TRANSLATE_CREATE_GROUP;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const dispatch = useDispatch();
  const [createGroup] = useCreateGroupMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { imageUrl, pickAndUploadImage } = useUploadImage();

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));

      // return () => {
      //   dispatch(setMainTabHidden(false));
      // };
    }, [dispatch]),
  );

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
    name: Yup.string().trim().required(MESSAGE_VALIDATE.GROUP_NAME_REQUIRED),
    description: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED),
    currentBalance: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.CURRENT_BALANCE_REQUIRED),
    accountBankId: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.ACCOUNT_BANKING_REQUIRED),
  });

  const handleCreateGroup = useCallback(
    async (payload: CreateGroupPayload) => {
      dispatch(setLoading(true));
      const updatePayload = {
        ...payload,
        image: imageUrl,
        currentBalance: Number(payload.currentBalance),
      };
      try {
        const res = await createGroup(updatePayload).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            SUCCESS_MESSAGES.GROUP_CREATED_SUCCESSFULLY,
            ToastAndroid.SHORT,
          );
          router.navigate(PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any);
          dispatch(setMainTabHidden(true));
          dispatch(setGroupTabHidden(false));
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
      imageUrl,
    },
    handler: {
      validationSchema,
      handleCreateGroup,
      pickAndUploadImage,
    },
  };
};

export default useCreateGroupScreen;
