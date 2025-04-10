import { useField } from "formik";
import { Eye, EyeSlash } from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface CommonInputProps {
  name: string;
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
  formatter?: (value: string) => string;
  onValidationChange?: (isValid: boolean) => void;
  [key: string]: any;
}

const InputComponent = ({
  name,
  label,
  icon,
  rightIcon,
  placeholder,
  isPrivate = false,
  isRequired = false,
  inputMode = "text",
  containerClass = "",
  labelClass = "",
  inputClass = "",
  errorTextClass = "",
  formatter,
  onValidationChange,
  ...props
}: CommonInputProps) => {
  const [field, meta, helpers] = useField(name);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPrivate);
  const [localError, setLocalError] = useState<string | undefined>();

  const handleChangeText = (text: string) => {
    const formattedText = formatter ? formatter(text) : text;
    helpers.setValue(formattedText);

    if (name === "amount") {
      const numericValue = Number(text.replace(/\./g, ""));
      if (numericValue > 0 && numericValue < 10000) {
        helpers.setError("Giá trị thấp nhất là 10.000đ");
      } else {
        helpers.setError(undefined);
      }
    }
  };

  return (
    <View className={`${containerClass} mb-5`} {...props}>
      <View className="mb-1 flex-row items-center">
        {isRequired && <Text className="mr-1 text-red">*</Text>}
        <Text
          className={`${labelClass} ${
            (meta.touched && meta.error) || localError ? "text-red" : ""
          }`}
        >
          {label}
        </Text>
      </View>
      <View className="relative">
        <TextInput
          className={`h-10 rounded-md border px-3 ${
            icon ? "pl-10" : "pl-3"
          } ${isPrivate || rightIcon ? "pr-10" : "pr-3"} ${
            (meta.touched && meta.error) || localError
              ? "border-red"
              : "border-gray-300"
          } ${inputClass}`}
          placeholder={placeholder}
          secureTextEntry={!isPasswordVisible && isPrivate}
          inputMode={inputMode}
          value={field.value}
          onChangeText={handleChangeText}
          onBlur={() => helpers.setTouched(true)}
          {...props}
        />

        {icon && <View className="absolute left-3 top-2.5">{icon}</View>}

        {isPrivate ? (
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
        ) : (
          rightIcon && (
            <View className="absolute right-3 top-3">{rightIcon}</View>
          )
        )}

        {((meta.touched && meta.error) || localError) && (
          <Text
            className={`${errorTextClass} absolute -bottom-5 mt-2 text-[12px] text-red`}
          >
            {localError || meta.error}
          </Text>
        )}
      </View>
    </View>
  );
};

export { InputComponent };
