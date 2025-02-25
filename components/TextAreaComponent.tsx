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
  containerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorTextClass?: string;
}

const TextAreaComponent = ({
  name,
  label,
  placeholder,
  isRequired = false,
  numberOfLines = 4,
  minHeight = 100,
  containerClass = "",
  labelClass = "",
  inputClass = "",
  errorTextClass = "",
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
          onChangeText={(text) => helpers.setValue(text)}
          onBlur={() => helpers.setTouched(true)}
          style={{
            minHeight: minHeight,
          }}
        />

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
