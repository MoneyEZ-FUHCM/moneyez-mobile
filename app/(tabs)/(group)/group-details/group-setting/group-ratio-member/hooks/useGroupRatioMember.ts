import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import { PATH_NAME } from "@/helpers/constants/pathname";

export interface Member {
  id: number;
  name: string;
  ratio: number;
  isYou?: boolean;
  avatar?: any;
}

export interface GroupRatioMemberState {
  members: Member[];
  localSliderValues: Record<number, number>;
  activeSlider: number | null;
  displayTotal: number;
  localTotal: number;
}

export default function useGroupRatioMember() {
  const [members, setMembers] = useState<Member[]>([
    { id: 1, name: "Đặng Gia Đức", ratio: 33, isYou: true },
    { id: 2, name: "Dương Bảo", ratio: 33 },
    { id: 3, name: "Minh Trí", ratio: 34 },
  ]);

  const {GROUP_SETTING} = PATH_NAME

  const [localSliderValues, setLocalSliderValues] = useState<Record<number, number>>(() =>
    members.reduce((acc, member) => {
      acc[member.id] = member.ratio;
      return acc;
    }, {} as Record<number, number>)
  );

  const [activeSlider, setActiveSlider] = useState<number | null>(null);
  const previousValuesRef = useRef<Record<number, number>>({});

  useEffect(() => {
    const nextValues = members.reduce((acc, member) => {
      acc[member.id] = member.ratio;
      return acc;
    }, {} as Record<number, number>);
    setLocalSliderValues(nextValues);
    previousValuesRef.current = { ...nextValues };
  }, [members]);

  const localTotal = useMemo(() => 
    Object.values(localSliderValues).reduce((sum, val) => sum + val, 0),
    [localSliderValues]
  );
  
  const displayTotal = useMemo(() => Math.round(localTotal), [localTotal]);

  const getTotalColor = useCallback(() => {
    if (Math.abs(localTotal - 100) < 0.01) return "#4CAF50"; 
    if (localTotal < 100) return "#2196F3"; 
    return "#F44336"; 
  }, [localTotal]);

  const adjustOtherMembers = useCallback((activeMemberId: number, newValue: number) => {
    const currentValue = localSliderValues[activeMemberId];
    const difference = newValue - currentValue;
    
    if (difference <= 0 || localTotal < 100) {
      setLocalSliderValues(prev => ({
        ...prev,
        [activeMemberId]: newValue
      }));
      return;
    }
    
    const otherMemberIds = members
      .filter(m => m.id !== activeMemberId)
      .map(m => m.id);
    
    if (otherMemberIds.length === 0) return;
    
    const otherMembersTotal = otherMemberIds.reduce(
      (sum, id) => sum + localSliderValues[id], 0
    );
    
    if (otherMembersTotal <= 0) return;
    
    const newValues = { ...localSliderValues };
    newValues[activeMemberId] = newValue;
    
    otherMemberIds.forEach(id => {
      const proportion = localSliderValues[id] / otherMembersTotal;
      const reduction = difference * proportion;
      newValues[id] = Math.max(0, localSliderValues[id] - reduction);
    });
    
    const newTotal = Object.values(newValues).reduce((sum, val) => sum + val, 0);
    if (newTotal > 100) {
      const excess = newTotal - 100;
      newValues[activeMemberId] -= excess;
    }
    
    setLocalSliderValues(newValues);
  }, [localSliderValues, localTotal, members]);

  const handleInputChange = useCallback((id: number, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    const newValue = Math.max(0, Math.min(100, numValue));
    adjustOtherMembers(id, newValue);
  }, [adjustOtherMembers]);

  const updateMemberRatio = useCallback((id: number, newRatio: number) => {
    setMembers(prevMembers => {
      const currentMember = prevMembers.find(m => m.id === id);
      if (!currentMember) return prevMembers;

      const change = newRatio - currentMember.ratio;
      const currentTotal = prevMembers.reduce((sum, member) => sum + member.ratio, 0);
      const newTotal = currentTotal + change;

      if ((currentTotal === 100 && change > 0) || newTotal > 100) {
        return prevMembers;
      }

      return prevMembers.map(member =>
        member.id === id ? { ...member, ratio: newRatio } : member
      );
    });
  }, []);

  const handleUpdate = useCallback(() => {
    const total = members.reduce((sum, member) => sum + member.ratio, 0);
    if (total !== 100) {
      Alert.alert("Invalid Distribution", "The total percentage must equal 100% before updating.", [
        { text: "OK" },
      ]);
      return;
    }
    Alert.alert("Success", "Contribution ratios updated successfully!");
  }, [members]);

  const handleGoBack = useCallback(() => {
    router.replace(GROUP_SETTING.GROUP_SETTING_DEFAULT as any);
  }, []);

  return {
    state: {
      members,
      localSliderValues,
      activeSlider,
      displayTotal,
      localTotal
    },
    handler: {
      updateMemberRatio,
      handleUpdate,
      handleGoBack,
      setLocalSliderValues,
      setActiveSlider,
      getTotalColor,
      adjustOtherMembers,
      handleInputChange
    },
  };
}