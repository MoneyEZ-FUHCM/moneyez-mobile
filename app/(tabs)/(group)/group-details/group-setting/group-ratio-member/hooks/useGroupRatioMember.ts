import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";

export interface Member {
  id: number;
  name: string;
  ratio: number;
  isYou?: boolean;
  avatar?: any;
}

export default function useGroupRatioMember() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Đặng Gia Đức", ratio: 33, isYou: true },
    { id: 2, name: "Dương Bảo", ratio: 33 },
    { id: 3, name: "Minh Trí", ratio: 34 },
  ]);

  const { GROUP_SETTING } = PATH_NAME;

  const initialValuesRef = useRef<Record<number, number>>(
    members.reduce(
      (acc, member) => {
        acc[member.id] = member.ratio;
        return acc;
      },
      {} as Record<number, number>,
    ),
  );

  const tempValuesRef = useRef<Record<number, number>>(
    members.reduce(
      (acc, member) => {
        acc[member.id] = member.ratio;
        return acc;
      },
      {} as Record<number, number>,
    ),
  );

  const [localSliderValues, setLocalSliderValues] = useState<
    Record<number, number>
  >(initialValuesRef.current);

  const [tooltipValue, setTooltipValue] = useState<{
    id: number | null;
    value: number;
  }>({
    id: null,
    value: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleSliderStart = useCallback(
    (memberId: number) => {
      tempValuesRef.current = { ...localSliderValues };
      setIsDragging(true);
      setTooltipValue({
        id: memberId,
        value: Math.round(localSliderValues[memberId]),
      });
    },
    [localSliderValues],
  );

  const handleSliderChange = useCallback((memberId: number, value: number) => {
    tempValuesRef.current[memberId] = Math.max(0, Math.min(150, value));
    setTooltipValue({ id: memberId, value: Math.round(value) });
  }, []);

  const handleSliderComplete = useCallback((memberId: number) => {
    setLocalSliderValues((prev) => ({
      ...prev,
      [memberId]: tempValuesRef.current[memberId],
    }));
    setIsDragging(false);
    setTooltipValue({ id: null, value: 0 });
  }, []);

  const handleInputChange = useCallback((id: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newValue = Math.max(0, Math.min(100, numValue));

    tempValuesRef.current[id] = newValue;
    setLocalSliderValues((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  }, []);

  const handleUpdate = useCallback(() => {
    const values = Object.values(localSliderValues);
    const total = values.reduce((sum, val) => sum + val, 0);

    if (Math.abs(total - 100) > 0.01) {
      Alert.alert(
        "Invalid Distribution",
        "The total percentage must equal 100% before updating.",
        [{ text: "OK" }],
      );
      return;
    }

    setMembers((prevMembers) =>
      prevMembers.map((member) => ({
        ...member,
        ratio: Math.round(localSliderValues[member.id]),
      })),
    );

    Alert.alert("Success", "Contribution ratios updated successfully!");
  }, [localSliderValues]);

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
    router.replace(GROUP_SETTING.GROUP_SETTING_DEFAULT as any);
  }, []);

  return {
    state: {
      members,
      localSliderValues,
      displayTotal,
      localTotal,
      tooltipValue,
      isDragging,
    },
    handler: {
      handleUpdate,
      handleGoBack,
      getTotalColor,
      handleInputChange,
      handleSliderStart,
      handleSliderChange,
      handleSliderComplete,
    },
  };
}
