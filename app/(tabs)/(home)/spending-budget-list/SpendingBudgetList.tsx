import {
  ModalLizeComponent,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { Colors } from "@/helpers/constants/color";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatCurrency } from "@/helpers/libs";
import { Entypo, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useSpendingBudget from "./hooks/useSpendingBudgetList";
import TEXT_TRANSLATE_SPENDING_BUDGET from "./SpendingBudgetList.translate";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SpendingBudget() {
  const { state, handler } = useSpendingBudget();
  const { cycleInfo, budgetSections, isLoading } = state;
  const { handleAddBudget, handleBack, handleBudgetPress, handleRefresh } =
    handler;

  const renderRulesContent = () => {
    return (
      <View className="p-5">
        <Text className="mb-4 text-center text-xl font-bold text-black">
          Ngân sách chi tiêu cá nhân
        </Text>

        <View className="mb-4">
          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Ngân sách chi tiêu cá nhân là người dùng đặt ra mục tiêu số tiền
              cần dùng / tiết kiệm dựa trên các danh mục con của người dùng đang
              chọn.
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Ngân sách chi tiêu cá nhân sẽ tính theo thời gian của mô hình chi
              tiêu đang hoạt động của người dùng đó.
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Ngân sách chi tiêu cá nhân được validate bằng cách xác định ngân
              sách được tạo nằm trong danh mục nào của mô hình, từ đó đưa ra
              giới hạn dựa vào thu nhập của người dùng tương ứng với % của danh
              mục chứa nó.
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Người dùng có thể cập nhật chi tiêu cá nhân khi chưa đến deadline
              (deadline dựa theo thời gian mô hình đang dùng)
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Ngân sách chi tiêu cá nhân sẽ tự chuyển sang trạng thái{" "}
              <Text className="font-bold text-green">COMPLETED</Text> sau khi
              ghi nhận đã đạt hoặc{" "}
              <Text className="font-bold text-red">ARCHIVED</Text> nếu nó đã hết
              hạn
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="mt-5 rounded-lg bg-primary py-3"
          onPress={() => state.modalizeRef.current?.close()}
        >
          <Text className="text-center font-medium text-white">Đóng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
        <SectionComponent rootClassName="h-14 bg-white justify-center">
          <View className="flex-row items-center justify-between px-5">
            <Pressable onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} />
            </Pressable>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_SPENDING_BUDGET.TITLE.MAIN_TITLE}
            </Text>
            <SpaceComponent width={24} />
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-primary">
            {COMMON_CONSTANT.LOADING_TRANSLATE.LOADING}
          </Text>
        </SectionComponent>
      </SafeAreaViewCustom>
    );
  }

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
        {/* Header */}
        <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} />
            </Pressable>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_SPENDING_BUDGET.TITLE.MAIN_TITLE}
            </Text>
            <Pressable onPress={handler.openRulesModal}>
              <FontAwesome6 name="circle-question" size={24} />
            </Pressable>
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="bg-white p-4 mt-2.5">
          <View className="mb-2">
            <Text className="text-base font-semibold">
              Chu kỳ {cycleInfo?.cycle}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500">
              Còn {cycleInfo?.remainingDays} ngày nữa hết chu kỳ
            </Text>
            <Pressable
              onPress={handleAddBudget}
              className="flex-row items-center"
            >
              <Entypo
                name="circle-with-plus"
                size={21}
                color={Colors.colors.primary}
              />
              <Text className="ml-1 text-base font-semibold text-[#609084]">
                {TEXT_TRANSLATE_SPENDING_BUDGET.BUTTON.ADD_BUDGET}
              </Text>
            </Pressable>
          </View>
        </SectionComponent>
        <ScrollViewCustom
          showsVerticalScrollIndicator={false}
          isBottomTab={false}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={handleRefresh} />
          }
        >
          {/* Budget Sections */}
          <View className="m-4">
            {budgetSections &&
              budgetSections?.length > 0 &&
              budgetSections?.map((section) => (
                <SectionComponent
                  key={section?.id}
                  rootClassName="mb-[10px] bg-white rounded-[10px] p-[10px]"
                >
                  <View className="mb-4 w-full flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-[#808080]">
                      {section?.category}
                    </Text>
                    <View
                      className={`ml-2 rounded-sm px-2 py-0.5 ${
                        section?.isSaving ? "bg-[#E8F0EE]" : "bg-[#FFF3E0]"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          section?.isSaving ? "text-blue-400" : "text-[#FF9800]"
                        }`}
                      >
                        {section?.isSaving ? "Tiết kiệm" : "Khoản chi"}
                      </Text>
                    </View>
                  </View>
                  {section?.items &&
                    section?.items?.length > 0 &&
                    section?.items?.map((item) => {
                      const progressPercent =
                        item?.currentAmount / item?.targetAmount;
                      return (
                        <Pressable
                          key={item?.id}
                          onPress={() =>
                            handleBudgetPress(item?.id, item?.subcategoryId)
                          }
                          className="mb-3 flex-row items-center justify-between rounded-[10px] border border-[#609084] p-3"
                        >
                          <View className="flex-row items-center space-x-3">
                            <View>
                              <ProgressCircleComponent
                                value={progressPercent}
                                size={72}
                                thickness={9}
                                isSaving={item?.isSaving}
                                iconName={item?.icon}
                                iconSize={28}
                              />
                            </View>
                            <View className="gap-y-1">
                              <Text className="text-base font-bold text-black">
                                {item?.name}
                              </Text>
                              <View className="flex-col gap-0.5">
                                <View className="flex-row items-center space-x-1">
                                  {item?.remaining > 0 ? (
                                    <Text className="!font-bold text-primary">
                                      <Text className="text-sm !font-normal !text-[#808080]">
                                        {
                                          TEXT_TRANSLATE_SPENDING_BUDGET.LABELS
                                            .REMAINING
                                        }
                                      </Text>
                                      {formatCurrency(item?.remaining)}
                                    </Text>
                                  ) : item?.isSaving ? (
                                    <Text className="font-bold text-green">
                                      Đã vượt kỳ vọng{" "}
                                      {formatCurrency(
                                        item?.currentAmount -
                                          item?.targetAmount,
                                      )}
                                    </Text>
                                  ) : (
                                    <Text className="font-bold text-red">
                                      Đã vượt hạn mức{" "}
                                      {formatCurrency(
                                        item?.currentAmount -
                                          item?.targetAmount,
                                      )}
                                    </Text>
                                  )}
                                </View>
                                <View className="flex-row items-center space-x-1">
                                  <Text className="text-sm text-text-gray">
                                    {TEXT_TRANSLATE_SPENDING_BUDGET.LABELS.REAL}
                                  </Text>
                                  <View className="flex-row items-center">
                                    <Text className="text-sm font-bold text-black">
                                      {formatCurrency(item?.currentAmount)}
                                    </Text>
                                    <Text className="text-sm text-text-gray">
                                      {" / "}
                                      {formatCurrency(item?.targetAmount)}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                </SectionComponent>
              ))}
          </View>
        </ScrollViewCustom>
        <ModalLizeComponent ref={state.modalizeRef}>
          {renderRulesContent()}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
