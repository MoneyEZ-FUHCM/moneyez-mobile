import {
  InputComponent,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { formatCurrency, formatCurrencyInput } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";
import TEXT_TRANSLATE_GROUP_REMIND from "./GroupFundRemind.translate";
import useGroupRemind from "./hooks/useGroupFundRemind";

export default function GroupRemindPage() {
  const { state, refState, handler } = useGroupRemind();
  const { LABELS, BUTTON, TABS, MESSAGE_VALIDATE } =
    TEXT_TRANSLATE_GROUP_REMIND;

  const FundRequestSchema = Yup.object().shape({
    amount: Yup.string()
      .required(MESSAGE_VALIDATE.AMOUNT_REQUIRED)
      .test(
        "is-valid-amount",
        MESSAGE_VALIDATE.AMOUNT_MUST_GREATER_THAN_ZERO,
        (value) => {
          const numericValue = value ? parseInt(value.replace(/\D/g, "")) : 0;
          return numericValue > 0;
        },
      ),
    description: Yup.string()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED)
      .min(5, MESSAGE_VALIDATE.DESCRIPTION_MIN_LENGTH),
  });

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center relative">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_GROUP_REMIND.TITLE.GROUP_REMIND}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-4">
          {/* Group Target Info - Only show if group has a financial goal */}
          {state.isGoalActive && state.hasFinancialGoal && (
            <SectionComponent rootClassName="rounded-2 bg-white p-4 shadow-sm">
              <Text className="text-base font-semibold">
                {LABELS.GROUP_TARGET}: {state.goalName} ({state.members.length}{" "}
                thành viên)
              </Text>
              <View className="mt-2 flex-row items-center space-x-3">
                <View>
                  <ProgressCircleComponent
                    value={
                      state.groupCurrent >= state.groupGoal
                        ? 1
                        : state.groupCurrent / state.groupGoal
                    }
                    size={60}
                    thickness={4}
                    showPercentage={true}
                  />
                </View>
                <View className="gap-1">
                  <Text>
                    <Text className="text-lg font-semibold text-[#609084]">
                      {formatCurrency(state.groupCurrent)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {" / "}
                      {formatCurrency(state.groupGoal)}
                    </Text>
                  </Text>
                  <Text className="text-sm text-[#848484]">
                    {LABELS.REMAINING}: {formatCurrency(state.remain)}
                  </Text>
                  <Text className="text-sm">
                    <Text className="font-semibold text-gray-500">
                      {LABELS.DUE_DATE}: {state.dueDate}
                    </Text>
                    <Text className="text-gray-500">
                      {" "}
                      (còn lại {state.remainDays} ngày)
                    </Text>
                  </Text>
                </View>
              </View>
            </SectionComponent>
          )}

          {/* Tabs */}

          {/* Tab Content: Tạo mới */}
          <SectionComponent rootClassName="rounded-2 bg-white shadow-sm px-3 pb-5">
            <Text className="py-4 text-base font-semibold">
              {LABELS.ADD_REMIND}
            </Text>
            <Formik
              initialValues={{
                amount: "",
                description: "",
              }}
              validationSchema={FundRequestSchema}
              innerRef={(ref) => (refState.formikRef.current = ref)}
              onSubmit={(values) => {
                handler.handleCreateRemind(values);
              }}
            >
              {({ handleSubmit }) => {
                handler.handleSubmitRef.current = handleSubmit;
                return (
                  <>
                    <SectionComponent>
                      <InputComponent
                        name="amount"
                        label={LABELS.AMOUNT_REQUIRE}
                        placeholder={LABELS.AMOUNT_PLACEHOLDER}
                        inputMode="numeric"
                        isRequired
                        labelClass="text-text-gray text-sm"
                        formatter={formatCurrencyInput}
                      />
                      <SpaceComponent height={10} />
                      <TextAreaComponent
                        name="description"
                        label={LABELS.DESCRIPTION}
                        placeholder={LABELS.DESCRIPTION_PLACEHOLDER}
                        labelClass="text-text-gray text-sm"
                        isRequired
                        maxLength={250}
                      />
                    </SectionComponent>
                  </>
                );
              }}
            </Formik>
          </SectionComponent>

          {/* Members List */}
          <SectionComponent rootClassName=" mt-4 rounded-[10px] bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-semibold">
                {LABELS.MEMBER_LIST}
              </Text>
              <Pressable onPress={handler.handleToggleAll}>
                <Text className="text-sm font-semibold text-[#609084]">
                  {state.members
                    .filter((m) => !m.disabled)
                    .every((member) => member.checked)
                    ? TEXT_TRANSLATE_GROUP_REMIND.BUTTON.UNSELECT_ALL
                    : TEXT_TRANSLATE_GROUP_REMIND.BUTTON.SELECT_ALL}
                </Text>
              </Pressable>
            </View>
            {state.members.length > 0 &&
              state.members.map((member) => (
                <View key={member.id} className="flex-row items-center py-2">
                  {member?.avatar ? (
                    <Image
                      source={member.avatar}
                      className="mr-3 h-12 w-12 rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <LinearGradient
                      colors={["#609084", "#4A7A70"]}
                      className="mr-3 h-12 w-12 items-center justify-center rounded-full shadow-md"
                    >
                      <Text className="text-2xl font-semibold uppercase text-white">
                        {member?.name?.charAt(0)}
                      </Text>
                    </LinearGradient>
                  )}

                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-base font-semibold">
                        {member.name}
                      </Text>
                      {member.userId === state.userInfo?.id && (
                        <View className="ml-2 rounded-md bg-[#E6F2EF] px-2 py-0.5">
                          <Text className="text-xs font-medium text-[#609084]">
                            Trưởng nhóm
                          </Text>
                        </View>
                      )}
                    </View>
                    {state.isGoalActive && state.hasFinancialGoal && (
                      <Text className="text-sm text-gray-500">
                        {LABELS.CONTRIBUTE_RATIO}: {member.ratio}%
                      </Text>
                    )}
                    <Text className="pt-1 text-sm">
                      <Text className="text-[#848484]">
                        {LABELS.CONTRIBUTED}:{" "}
                      </Text>
                      <Text className="text-base font-semibold text-[#609084]">
                        {formatCurrency(member.contributed)}
                      </Text>
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handler.handleToggleMember(member.id)}
                    disabled={
                      member.disabled || member.userId === state.userInfo?.id
                    }
                  >
                    <View className="h-6 w-6 items-center justify-center">
                      {member.checked ? (
                        <MaterialIcons
                          name="check-box"
                          size={24}
                          color="#609084"
                        />
                      ) : (
                        <MaterialIcons
                          name="check-box-outline-blank"
                          size={24}
                          color={
                            member.disabled ||
                            member.userId === state.userInfo?.id
                              ? "#e5e7eb"
                              : "#d1d5db"
                          }
                        />
                      )}
                    </View>
                  </Pressable>
                </View>
              ))}
          </SectionComponent>
        </View>
      </ScrollView>

      <SectionComponent rootClassName="px-5 rounded-lg w-full bg-white shadow-lg py-3">
        <Pressable
          onPress={() => handler.handleSubmitRef.current()}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {BUTTON.REMIND}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
