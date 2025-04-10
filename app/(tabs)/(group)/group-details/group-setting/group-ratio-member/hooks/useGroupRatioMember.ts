import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useContributeGroupMutation } from "@/services/group";
import { GroupMember } from "@/types/group.type";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_GROUP_RATIO_MEMBER from "../GroupRatioMember.translate";
import { setLoading } from "@/redux/slices/loadingSlice";
import { GROUP_MEMBER_STATUS } from "@/enums/globals";

export interface Member {
  id: number;
  name: string;
  ratio: number;
  isYou?: boolean;
  avatar?: any;
}

export default function useGroupRatioMember() {
  const dispatch = useDispatch();
  const groupDetail = useSelector(selectCurrentGroup);
  const groupMembersDetail = groupDetail?.groupMembers;
  const userInfo = useSelector(selectUserInfo);
  const [contributeGroup] = useContributeGroupMutation();
  const { SYSTEM_ERROR } = COMMON_CONSTANT;

  const groupMembersDetailActive = (groupMembersDetail ?? []).filter(
    ({ status }) => status === GROUP_MEMBER_STATUS.ACTIVE,
  );

  const initialValuesRef = useRef<Record<string, number>>(
    groupMembersDetailActive?.reduce(
      (acc, member: GroupMember) => {
        acc[member.userId] = member.contributionPercentage;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  const tempValuesRef = useRef<Record<string, number>>(
    groupMembersDetailActive?.reduce(
      (acc, member: GroupMember) => {
        acc[member.userId] = member.contributionPercentage;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  const [localSliderValues, setLocalSliderValues] = useState<
    Record<string, number>
  >(initialValuesRef.current);

  const [tooltipValue, setTooltipValue] = useState<{
    id: string | null;
    value: number;
  }>({
    id: null,
    value: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const result = useMemo(
    () =>
      Object.entries(localSliderValues)?.map(([memberId, contribution]) => ({
        memberId,
        contribution,
      })),
    [localSliderValues],
  );

  const handleSliderStart = useCallback(
    (memberId: string) => {
      tempValuesRef.current = { ...localSliderValues };
      setIsDragging(true);
      setTooltipValue({
        id: memberId,
        value: Math.round(localSliderValues[memberId]),
      });
    },
    [localSliderValues],
  );

  const handleSliderChange = useCallback((memberId: string, value: number) => {
    tempValuesRef.current[memberId] = Math.max(0, Math.min(150, value));
    setTooltipValue({ id: memberId, value: Math.round(value) });
  }, []);

  const handleSliderComplete = useCallback((memberId: string) => {
    setLocalSliderValues((prev) => ({
      ...prev,
      [memberId]: tempValuesRef.current[memberId],
    }));
    setIsDragging(false);
    setTooltipValue({ id: null, value: 0 });
  }, []);

  const handleInputChange = useCallback((id: string, value: string) => {
    if (value === "") {
      setEditingId(id);
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newValue = Math.max(0, Math.min(100, numValue));
    setEditingId(null);
    tempValuesRef.current[id] = newValue;
    setLocalSliderValues((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  }, []);

  const handleInputBlur = useCallback(
    (id: string) => {
      if (editingId === id) {
        setEditingId(null);
        setLocalSliderValues((prev) => ({
          ...prev,
          [id]: tempValuesRef.current[id],
        }));
      }
    },
    [editingId],
  );

  const handleUpdate = useCallback(async () => {
    const payload = {
      groupId: groupDetail?.id,
      memberContributions: result,
    };

    dispatch(setLoading(true));
    try {
      await contributeGroup(payload).unwrap();
      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_RATIO_MEMBER.MESSAGE_SUCCESS
          .UPDATE_CONTRIBUTE_SUCCESS,
        ToastAndroid.SHORT,
      );
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  }, [groupDetail?.id, localSliderValues, contributeGroup]);

  const localTotal = useMemo(
    () => Object.values(localSliderValues).reduce((sum, val) => sum + val, 0),
    [localSliderValues],
  );

  const displayTotal = useMemo(() => Math.round(localTotal), [localTotal]);

  const getTotalColor = useCallback(() => {
    if (Math.abs(localTotal - 100) < 0.01) return "#4CAF50";
    if (localTotal < 100) return "#2196F3";
    return "#F44336";
  }, [localTotal]);

  const handleGoBack = useCallback(() => {
    dispatch(setGroupTabHidden(false));
    router.back();
  }, []);

  const handleEqualShare = useCallback(() => {
    const memberCount = groupMembersDetailActive.length;
    if (memberCount === 0) return;

    const equalShare = Math.floor(100 / memberCount);
    const remainder = 100 % memberCount;

    const newValues = groupMembersDetailActive.reduce(
      (acc, member, index) => {
        acc[member.userId] = index === 0 ? equalShare + remainder : equalShare;
        return acc;
      },
      {} as Record<string, number>,
    );

    setLocalSliderValues(newValues);
    tempValuesRef.current = newValues;
  }, [groupMembersDetailActive]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleGoBack]),
  );

  return {
    state: {
      localSliderValues,
      displayTotal,
      localTotal,
      tooltipValue,
      isDragging,
      groupMembersDetail: groupMembersDetailActive ?? [],
      userInfo,
      editingId,
    },
    handler: {
      handleUpdate,
      handleGoBack,
      getTotalColor,
      handleInputChange,
      handleSliderStart,
      handleSliderChange,
      handleSliderComplete,
      handleInputBlur,
      handleEqualShare,
    },
  };
}
