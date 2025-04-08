import Admin from "@/assets/images/logo/avatar_admin.jpg";
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
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
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
          {/* Group Target Info */}
          <SectionComponent rootClassName="rounded-2 bg-white p-4 shadow-sm">
            <Text className="text-base font-semibold">
              {LABELS.GROUP_TARGET} ({state.members.length} thành viên)
            </Text>
            <View className="mt-2 flex-row items-center space-x-3">
              <View>
                <ProgressCircleComponent
                  value={state.groupCurrent / state.groupGoal}
                  size={60}
                  color="#609084"
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

          {/* Tabs */}
          <View className="mt-4 flex-row overflow-hidden rounded-lg bg-white">
            <Pressable
              onPress={() => handler.handleSelectTab("add")}
              className={`flex-1 items-center py-3 ${
                state.selectedTab === "add" ? "border-b-4 border-[#609084]" : ""
              }`}
            >
              <Text
                className={`text-sm ${
                  state.selectedTab === "add"
                    ? "font-semibold text-[#609084]"
                    : "text-black"
                }`}
              >
                {TABS.ADD}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handler.handleSelectTab("history")}
              className={`flex-1 items-center py-3 ${
                state.selectedTab === "history"
                  ? "border-b-4 border-[#609084]"
                  : ""
              }`}
            >
              <Text
                className={`text-sm ${
                  state.selectedTab === "history"
                    ? "font-semibold text-[#609084]"
                    : "text-black"
                }`}
              >
                {TABS.HISTORY}
              </Text>
            </Pressable>
          </View>

          {/* Tab Content: Tạo mới */}
          {state.selectedTab === "add" && (
            <>
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
                      {state.members.every((member) => member.checked)
                        ? TEXT_TRANSLATE_GROUP_REMIND.BUTTON.UNSELECT_ALL
                        : TEXT_TRANSLATE_GROUP_REMIND.BUTTON.SELECT_ALL}
                    </Text>
                  </Pressable>
                </View>
                {state.members.map((member) => (
                  <View
                    key={member.id}
                    className="flex-row items-center justify-between py-2"
                  >
                    <Image
                      source={member.avatar ? member.avatar : Admin}
                      className="h-12 w-12 rounded-full"
                      resizeMode="cover"
                    />
                    <View>
                      <Text className="text-base font-semibold">
                        {member.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {LABELS.CONTRIBUTE_RATIO}: {member.ratio}%
                      </Text>
                      <Text className="pt-1 text-sm">
                        <Text className="text-[#848484]">
                          {LABELS.CONTRIBUTED}:{" "}
                        </Text>
                        <Text className="text-base font-semibold text-[#609084]">
                          {formatCurrency(member.contributed)}
                        </Text>
                        <Text className="text-[#848484]">
                          {" "}
                          / {formatCurrency(member.target)}
                        </Text>
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handler.handleToggleMember(member.id)}
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
                            color="#d1d5db"
                          />
                        )}
                      </View>
                    </Pressable>
                  </View>
                ))}
              </SectionComponent>
            </>
          )}

          {/* Tab Content */}
          {state.selectedTab === "history" && (
            <SectionComponent rootClassName=" mt-4 rounded-[10px] bg-white p-4 shadow-sm">
              <Text className="mb-2 text-base font-semibold">
                Lịch sử lời nhắc
              </Text>
              <Text className="text-sm text-gray-500">
                (Chưa có lịch sử lời nhắc)
              </Text>
            </SectionComponent>
          )}
        </View>
      </ScrollView>

      {state.selectedTab === "add" && (
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
      )}
    </SafeAreaViewCustom>
  );
}
