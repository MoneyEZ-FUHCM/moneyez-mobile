import { useField } from "formik";
import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { RadioButton } from "react-native-paper";

interface RadioGroupComponentProps {
  readonly name: string;
  readonly options: ReadonlyArray<{ label: string; value: number }>;
  readonly label: string;
  readonly containerClass?: string;
  readonly orientation?: "horizontal" | "vertical";
  readonly spacing?: number;
}

export function RadioGroupComponent({
  name,
  options,
  label,
  containerClass,
  orientation = "vertical",
  spacing = 8,
}: Readonly<RadioGroupComponentProps>) {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value: number) => {
    helpers.setValue(value);
  };

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        <Text className="text-[12px] text-text-gray">{label}</Text>
      </View>
      <RadioButton.Group
        value={field.value?.toString()}
        onValueChange={(value) => handleChange(Number(value))}
      >
        <View
          style={{
            flexDirection: orientation === "horizontal" ? "row" : "column",
            gap: spacing,
          }}
        >
          {options.map((option) => (
            <TouchableWithoutFeedback
              key={option.value}
              onPress={() => handleChange(option.value)}
            >
              <View className="flex-row items-center">
                <RadioButton.Android
                  value={option.value.toString()}
                  color="#609084"
                  uncheckedColor="#ccc"
                  status={
                    field.value?.toString() === option.value.toString()
                      ? "checked"
                      : "unchecked"
                  }
                />
                <Text className="ml-2">{option.label}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </RadioButton.Group>
      {meta.touched && meta.error && (
        <Text className="absolute -bottom-5 mt-2 text-[12px] text-red">
          {meta.error}
        </Text>
      )}
    </View>
  );
}
