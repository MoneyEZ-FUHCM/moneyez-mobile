import { useField } from "formik";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface TextAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  numberOfLines?: number;
  minHeight?: number;
  maxLength?: number;
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorTextClass?: string;
  charCountClass?: string;
}

const TextAreaComponent = ({
  name,
  label,
  placeholder,
  isRequired = false,
  numberOfLines = 4,
  minHeight = 100,
  maxLength = 250,
  containerClass = "",
  labelClass = "",
  inputClass = "",
  errorTextClass = "",
  charCountClass = "",
}: TextAreaProps) => {
  const [field, meta, helpers] = useField(name);

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
          className={`rounded-md border px-3 py-2 ${
            meta.touched && meta.error ? "border-red" : "border-gray-300"
          } ${inputClass}`}
          placeholder={placeholder}
          multiline={true}
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          value={field.value}
          maxLength={maxLength}
          onChangeText={(text) => helpers.setValue(text)}
          onBlur={() => helpers.setTouched(true)}
          style={{
            minHeight: minHeight,
          }}
        />

        <Text
          className={`${charCountClass} absolute -bottom-5 right-0 text-right text-xs text-gray-500`}
        >
          {field.value?.length || 0}/{maxLength}
        </Text>

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

export { TextAreaComponent };
