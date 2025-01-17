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
      <View className="mb-2 flex-row items-center">
        {isRequired && <Text className="mr-1 text-red">*</Text>}
        <Text className={`${labelClass} font-semibold`}>{label}</Text>
      </View>
      <TextInput
        className={`rounded-md border p-3 text-base ${
          meta.touched && meta.error ? "border-red-500" : "border-gray-300"
        } ${inputClass}`}
        placeholder={placeholder}
        secureTextEntry={isPrivate}
        value={field.value}
        onChangeText={(text) => helpers.setValue(text)}
        onBlur={() => helpers.setTouched(true)}
      />
      {meta.touched && meta.error && (
        <Text className={`${errorTextClass} mt-2 text-sm text-red`}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export default InputComponent;
