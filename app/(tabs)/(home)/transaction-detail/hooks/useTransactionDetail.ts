import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { selectTransactionData } from "@/redux/hooks/transactionSelector";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setImageView } from "@/redux/slices/systemSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useCreateTransactionMutation,
  useGetTransactionDetailQuery,
} from "@/services/transaction";
import {
  CommonActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TRANSACTION_DETAIL_CONSTANT from "../TransactionDetail.constant";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../../add-transaction/AddTransaction.translate";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";

const useTransactionDetail = () => {
  const { transactionId } = useLocalSearchParams();
  const transactionData = useSelector(selectTransactionData);

  const images = [
    { uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4" },
    { uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34" },
    { uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111" },
  ];

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  const { data: transactionDetail, isLoading: isLoadingTransactionDetail } =
    useGetTransactionDetailQuery({
      transactionId: transactionId,
    });

  useEffect(() => {
    dispatch(setLoading(isLoadingTransactionDetail));
  }, [isLoadingTransactionDetail]);

  const previousPath = useRef<string | null>(null);
  const navigationState = useNavigationState((state) => state);
  const [createTransaction] = useCreateTransactionMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const {} = TRANSACTION_DETAIL_CONSTANT;
  const { MESSAGE_VALIDATE, MESSAGE_SUCCESS } = TEXT_TRANSLATE_ADD_TRANSACTION;
  const currentUserSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const navigation = useNavigation();
  useEffect(() => {
    if (
      Array.isArray(navigationState?.routes) &&
      navigationState.routes.length > 1
    ) {
      const previousRoute =
        navigationState.routes[navigationState.routes.length - 2];
      previousPath.current = previousRoute.name;
    }
  }, [navigationState]);

  const isFromPeriodHistory = previousPath.current?.includes(
    "period-history/PeriodHistoryDetail",
  );

  const handleSetImageView = useCallback(() => {
    dispatch(setImageView(true));
  }, []);

  const handleCreateTransaction = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const res = await createTransaction(transactionData).unwrap();
      if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
        ToastAndroid.show(
          MESSAGE_SUCCESS.CREATE_TRANSACTION_SUCCESSFUL,
          ToastAndroid.CENTER,
        );
        if (currentUserSpendingModel) {
          const startDate = new Date(
            currentUserSpendingModel?.startDate,
          ).toLocaleDateString("vi-VN");
          const endDate = new Date(
            currentUserSpendingModel?.endDate,
          ).toLocaleDateString("vi-VN");
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                { name: PATH_NAME.HOME.HOME_DEFAULT }, // Màn Home
                {
                  name: PATH_NAME.HOME.PERIOD_HISTORY,
                  params: {
                    userSpendingId: currentUserSpendingModel?.id,
                    startDate,
                    endDate,
                  },
                }, // Màn PeriodHistory
              ],
            }),
          );
        }
      }
    } catch (err: any) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  }, []);

  return {
    state: {
      isFromPeriodHistory,
      images,
      isLoadingTransactionDetail,
      transactionDetail: transactionDetail?.data,
      transactionData,
    },
    handler: {
      handleSetImageView,
      handleCreateTransaction,
    },
  };
};

export default useTransactionDetail;
