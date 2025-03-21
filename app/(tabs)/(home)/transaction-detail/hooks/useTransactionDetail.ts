import { setLoading } from "@/redux/slices/loadingSlice";
import { setImageView } from "@/redux/slices/systemSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetTransactionDetailQuery } from "@/services/transaction";
import { useNavigationState } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const useTransactionDetail = () => {
  const { transactionId } = useLocalSearchParams();
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

  return {
    state: {
      isFromPeriodHistory,
      images,
      isLoadingTransactionDetail,
      transactionDetail: transactionDetail?.data,
    },
    handler: {
      handleSetImageView,
    },
  };
};

export default useTransactionDetail;
