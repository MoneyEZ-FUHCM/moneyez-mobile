import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupId } from "../groupHomeDefaultSlice";
import { RootState } from "@/redux/store";

const useGroupHomeDefault = () => {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const dispatch = useDispatch();
  const storedGroupId = useSelector(
    (state: RootState) => state.groupHomeDefault.groupId,
  );

  useEffect(() => {
    if (groupId) {
      dispatch(setGroupId(groupId));
    }
  }, [groupId, dispatch]);

  return {
    state: {
      groupId: storedGroupId,
    },
    handler: {},
  };
};

export default useGroupHomeDefault;
