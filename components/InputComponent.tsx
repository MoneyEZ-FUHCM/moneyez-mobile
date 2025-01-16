import { useField } from "formik";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface CommonInputProps {
  name: string;
  label: string;
  placeholder?: string;
  isPrivate?: boolean;
  isRequired?: boolean;
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
  containerClass = "",
  labelClass = "",
  inputClass = "",
  errorTextClass = "",
}) => {
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
          className={`h-10 rounded-md border px-3 ${
            meta.touched && meta.error ? "border-red" : "border-gray-300"
          } ${inputClass}`}
          placeholder={placeholder}
          secureTextEntry={isPrivate}
          value={field.value}
          onChangeText={(text) => helpers.setValue(text)}
          onBlur={() => helpers.setTouched(true)}
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

export default InputComponent;
