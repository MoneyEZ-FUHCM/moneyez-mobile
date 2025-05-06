import {
  LoadingSectionWrapper,
  ModalLizeComponent,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency } from "@/helpers/libs";
import { Entypo, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useSpendingBudget from "./hooks/useSpendingBudgetList";
import TEXT_TRANSLATE_SPENDING_BUDGET from "./SpendingBudgetList.translate";

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

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-[#f9f9f9]">
        <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBack}
              className="rounded-full bg-gray-50 p-2"
            >
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_SPENDING_BUDGET.TITLE.MAIN_TITLE}
            </Text>
            <TouchableOpacity onPress={handler.openRulesModal} className="p-2">
              <FontAwesome6 name="circle-question" size={24} />
            </TouchableOpacity>
          </View>
        </SectionComponent>
        <LoadingSectionWrapper isLoading={isLoading}>
          {state.activeTab !== "unavailable" ? (
            <SectionComponent rootClassName="bg-white rounded-lg shadow-sm p-5 mt-3">
              <View className="mb-3 border-l-4 border-emerald-500 pl-3">
                <Text className="text-lg font-bold text-gray-800">
                  Chu kỳ {cycleInfo?.cycle}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialIcons name="access-time" size={18} color="#6B7280" />
                  <Text className="ml-2 text-sm text-gray-600">
                    Còn{" "}
                    <Text className="font-semibold text-emerald-600">
                      {cycleInfo?.remainingDays} ngày
                    </Text>{" "}
                    nữa hết chu kỳ
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleAddBudget}
                  className="flex-row items-center rounded-full bg-emerald-50 px-3 py-2"
                >
                  <Entypo name="circle-with-plus" size={18} color="#047857" />
                  <Text className="ml-1.5 text-sm font-medium text-emerald-700">
                    {TEXT_TRANSLATE_SPENDING_BUDGET.BUTTON.ADD_BUDGET}
                  </Text>
                </TouchableOpacity>
              </View>
            </SectionComponent>
          ) : (
            <SectionComponent rootClassName="bg-white mx-4 rounded-lg shadow-sm p-5  my-3 border-l-4 border-red">
              <View className="flex-row items-center">
                <MaterialIcons
                  name="error-outline"
                  size={20}
                  color={Colors.colors.red}
                />
                <Text className="ml-2 font-bold text-red">
                  Đã quá thời hạn sử dụng mô hình
                </Text>
              </View>
            </SectionComponent>
          )}
          <ScrollViewCustom
            showsVerticalScrollIndicator={false}
            isBottomTab={false}
            contentContainerStyle={{ paddingBottom: 180 }}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={handleRefresh} />
            }
          >
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
                            section?.isSaving
                              ? "text-blue-400"
                              : "text-[#FF9800]"
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
                                            TEXT_TRANSLATE_SPENDING_BUDGET
                                              .LABELS.REMAINING
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
                                      {
                                        TEXT_TRANSLATE_SPENDING_BUDGET.LABELS
                                          .REAL
                                      }
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
        </LoadingSectionWrapper>

        <ModalLizeComponent ref={state.modalizeRef}>
          {renderRulesContent()}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
