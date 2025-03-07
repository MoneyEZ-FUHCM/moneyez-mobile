import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Stack } from "expo-router";

export default function HomeLayout() {
  const { CONDITION, ANIMATION_NAVIGATE_STACK } = COMMON_CONSTANT;
  const { HOME } = PATH_NAME;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "var(--color-primary)" },
        headerShown: CONDITION.FALSE,
        animation: ANIMATION_NAVIGATE_STACK.SLIDE_FROM_RIGHT,
      }}
    >
      <Stack.Screen name={HOME.HOME_DEFAULT} />
      <Stack.Screen name={HOME.INDIVIDUAL_HOME} />
      <Stack.Screen name={HOME.ADD_TRANSACTION} />
      <Stack.Screen name={HOME.SPENDING_MODEL_HISTORY} />
      <Stack.Screen name={HOME.PERSONAL_EXPENSES_MODEL} />
      <Stack.Screen name={HOME.PERIOD_HISTORY} />
      <Stack.Screen name={HOME.PERIOD_HISTORY_DETAIL} />
    </Stack>
  );
}
