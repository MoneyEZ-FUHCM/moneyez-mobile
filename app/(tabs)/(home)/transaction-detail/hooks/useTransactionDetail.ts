import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectTransactionData } from "@/redux/hooks/transactionSelector";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setImageView } from "@/redux/slices/systemSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../../add-transaction/AddTransaction.translate";

import { useCreateTransactionMutation } from "@/services/transaction";

const useTransactionDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const transactionData = useSelector(selectTransactionData);
  const currentUserSpendingModel = useSelector(selectCurrentUserSpendingModel);

  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { MESSAGE_SUCCESS } = TEXT_TRANSLATE_ADD_TRANSACTION;

  const [createTransaction] = useCreateTransactionMutation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  const handleSetImageView = useCallback(() => {
    dispatch(setImageView(true));
  }, [dispatch]);

  const handleCreateTransaction = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const res = await createTransaction(transactionData).unwrap();
      if (res?.status === HTTP_STATUS.SUCCESS.CREATED) {
        ToastAndroid.show(
          MESSAGE_SUCCESS.CREATE_TRANSACTION_SUCCESSFUL,
          ToastAndroid.CENTER,
        );

        if (currentUserSpendingModel) {
          const startDate = new Date(
            currentUserSpendingModel.startDate,
          ).toLocaleDateString("vi-VN");
          const endDate = new Date(
            currentUserSpendingModel.endDate,
          ).toLocaleDateString("vi-VN");

          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: PATH_NAME.HOME.HOME_DEFAULT },
                {
                  name: PATH_NAME.HOME.PERIOD_HISTORY,
                  params: {
                    userSpendingId: currentUserSpendingModel.id,
                    startDate,
                    endDate,
                  },
                },
              ],
            }),
          );
        }
      }
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, createTransaction]);

  return {
    state: {
      transactionData,
    },
    handler: {
      handleSetImageView,
      handleCreateTransaction,
    },
  };
};

export default useTransactionDetail;
