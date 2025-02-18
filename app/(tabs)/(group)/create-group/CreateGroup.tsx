import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import Svg, { G, Mask, Path, Rect } from "react-native-svg";
import TEXT_TRANSLATE_CREATE_GROUP from "./CreateGroup.translate";
import { PATH_NAME } from "@/helpers/constants/pathname";

const CreateGroup = () => {
  const { TITLE, STEPS, BUTTON, TEXT, PLACEHOLDER } =
    TEXT_TRANSLATE_CREATE_GROUP;
  const navigation = useNavigation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [errors, setErrors] = useState({
    groupName: "",
    description: "",
    currentBalance: "",
  });

  const validateFields = () => {
    let valid = true;
    let errors = { groupName: "", description: "", currentBalance: "" };

    if (!groupName.trim()) {
      errors.groupName = "Tên nhóm không được để trống";
      valid = false;
    }

    if (!description.trim()) {
      errors.description = "Mô tả không được để trống";
      valid = false;
    }

    if (!currentBalance.trim() || isNaN(Number(currentBalance))) {
      errors.currentBalance = "Số dư hiện tại phải là một số hợp lệ";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };
  const handleSubmit = () => {
    if (validateFields()) {
      // Proceed with form submission
      router.navigate(PATH_NAME.GROUP.CREATE_GROUP_STEP_2 as any);
    } else {
      Alert.alert("Error", "Please fill all fields correctly.");
    }
  };

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
  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4 ">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TITLE.CREATE_NEW_GROUP}
          </Text>
        </View>
        <TouchableOpacity>
          <Entypo name="info-with-circle" size={24} color="#000000" />
        </TouchableOpacity>
      </SectionComponent>
      <View className="flex-1 bg-white">
        <View className="rounded-lg bg-white px-4 py-6">
          <View className="mb-6"></View>
          <View className="mb-6">
            <Text className="mb-2 text-lg font-bold text-primary">
              {STEPS.INFORMATION}
            </Text>
            <View className="rounded-lg bg-gray-100 p-4">
              <View className="mb-2">
                <Text className="mb-2 text-sm text-gray-600">
                  {TEXT.GROUP_NAME}
                </Text>
                <View className="rounded-lg border border-[#609084] bg-[#F6F9F4] p-2">
                  <TextInput
                    className="text-sm text-gray-800"
                    placeholder={PLACEHOLDER.ENTER_GROUP_NAME}
                    placeholderTextColor="#757575"
                    value={groupName}
                    onChangeText={setGroupName}
                  />
                </View>
                {errors.groupName ? (
                  <Text className="text-xs text-red">{errors.groupName}</Text>
                ) : null}
              </View>
              <View className="mb-2">
                <Text className="mb-2 text-sm text-gray-600">
                  {TEXT.DESCRIPTION}
                </Text>
                <View className="rounded-lg border border-[#609084] bg-[#F6F9F4] p-2">
                  <TextInput
                    className="text-sm text-gray-800"
                    placeholder={PLACEHOLDER.ENTER_DESCRIPTION}
                    placeholderTextColor="#757575"
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>
                {errors.description ? (
                  <Text className="text-xs text-red">{errors.description}</Text>
                ) : null}
              </View>
              <View className="mb-2">
                <Text className="mb-2 text-sm text-gray-600">
                  {TEXT.CURRENT_BALANCE}
                </Text>
                <View className="rounded-lg border border-[#609084] bg-[#F6F9F4] p-2">
                  <TextInput
                    className="text-sm text-gray-800"
                    placeholder={PLACEHOLDER.ENTER_CURRENT_BALANCE}
                    placeholderTextColor="#757575"
                    value={currentBalance}
                    onChangeText={setCurrentBalance}
                    keyboardType="numeric"
                  />
                </View>
                {errors.currentBalance ? (
                  <Text className="text-xs text-red">
                    {errors.currentBalance}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        {!isKeyboardVisible && (
          <View className="flex-1 justify-end pb-24">
            <TouchableOpacity
              onPress={() => handleSubmit()}
              className="w-full rounded-2xl px-4"
            >
              <View className="h-[49px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#5f8f84]">
                <Text className="font-['Inter'] text-base font-extrabold text-white">
                  {BUTTON.NEXT}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaViewCustom>
  );
};

export default CreateGroup;
