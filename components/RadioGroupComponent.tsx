import { useField } from "formik";
import React from "react";
import { Text, View } from "react-native";
import { RadioButton, RadioGroup } from "react-native-ui-lib";

interface RadioGroupComponentProps {
  name: string;
  options: { label: string; value: number }[];
  label: string;
  containerClass?: string;
}

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
  name,
  options,
  label,
  containerClass,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (value: string) => {
    helpers.setValue(value);
  };

  return (
    <View className={`${containerClass} mb-5`}>
      <View className="mb-1 flex-row items-center">
        <Text className="text-[12px] text-text-gray">{label}</Text>
      </View>
      <RadioGroup
        initialValue={field.value}
        onValueChange={handleChange}
        className="flex-row justify-between"
      >
        {options.map((option) => (
          <RadioButton
            key={option.value}
            value={option.value}
            label={option.label}
            color="#609084"
          />
        ))}
      </RadioGroup>
      {meta.touched && meta.error && (
        <Text className={`absolute -bottom-5 mt-2 text-[12px] text-red`}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export { RadioGroupComponent };
