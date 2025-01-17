import { useField } from "formik";
import { Eye, EyeSlash } from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CommonInputProps {
  name: string;
  label: string;
  placeholder?: string;
  isPrivate?: boolean;
  isRequired?: boolean;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "email"
    | "tel"
    | "search"
    | undefined;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorTextClass?: string;
}

const InputComponent: React.FC<CommonInputProps> = ({
  name,
  label,
  placeholder,
  isPrivate = false,
  isRequired = false,
  inputMode = "text",
  containerClass = "",
  labelClass = "",
  inputClass = "",
  errorTextClass = "",
}) => {
  const [field, meta, helpers] = useField(name);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPrivate);

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        {isRequired && <Text className="mr-1 text-red">*</Text>}
        <Text
          className={`${labelClass} ${meta.touched && meta.error ? "text-red" : ""}`}
        >
          {label}
        </Text>
      </View>
      <View className="relative">
        <TextInput
          className={`h-10 rounded-md border px-3 pr-10 ${
            meta.touched && meta.error ? "border-red" : "border-gray-300"
          } ${inputClass}`}
          placeholder={placeholder}
          secureTextEntry={!isPasswordVisible && isPrivate}
          inputMode={inputMode}
          value={field.value}
          onChangeText={(text) => helpers.setValue(text)}
          onBlur={() => helpers.setTouched(true)}
        />
        {isPrivate && (
          <TouchableOpacity
            className="absolute right-3 top-2.5"
            onPress={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? (
              <Eye size="18" color="#888" variant="Outline" />
            ) : (
              <EyeSlash size="18" color="#888" variant="Outline" />
            )}
          </TouchableOpacity>
        )}
        {meta.touched && meta.error && (
          <Text
            className={`${errorTextClass} absolute -bottom-5 mt-2 text-[12px] text-red`}
          >
            {meta.error}
          </Text>
        )}
      </View>
    </View>
  );
};

export default InputComponent;
