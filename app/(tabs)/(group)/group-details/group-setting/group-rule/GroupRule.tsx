import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { Colors } from "@/helpers/constants/color";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useGroupRule from "./hooks/useGroupRule";

const GroupRule = () => {
  const { state, handler } = useGroupRule();
  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SectionComponent rootClassName="flex-row relative justify-center items-center h-14 px-4 bg-white">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute bottom-[17px] left-4"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Quy định nhóm</Text>
      </SectionComponent>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 py-6"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <>
          <RuleSection
            title="Quy định chung"
            icon="shield-checkmark"
            iconColor={Colors.colors.blue}
            items={[
              <Text>
                <Text className="font-bold text-primary">MoneyEZ</Text> sẽ không
                đứng ra giữ tiền quỹ trong nhóm mà trưởng nhóm sẽ là người trực
                tiếp quản lý.
              </Text>,
              <Text>
                <Text className="font-bold text-primary">MoneyEZ</Text> sẽ đóng
                vai trò là một ứng dụng ghi chú để minh bạch các giao dịch trong
                nhóm.
              </Text>,
              <Text>
                <Text className="font-bold text-primary">MoneyEZ</Text> sẽ
                <Text className="font-bold text-primary">
                  {" "}
                  không can thiệp
                </Text>{" "}
                vào tranh chấp phát sinh giữa các thành viên. Điều này được ghi
                nhận trong thỏa thuận nhóm.
              </Text>,
            ]}
          />
          <RuleSection
            title="Dành cho trưởng nhóm"
            icon="ribbon"
            iconColor={Colors.colors.orange}
            items={[
              "Sử dụng tài khoản quản lý riêng để quản lý quỹ nhóm, không dùng tài khoản cá nhân.",
              "Có quyền quản lý toàn quyền các giao dịch thu - chi trên tài khoản nhóm.",
              "Các giao dịch nạp / rút quỹ nhóm có thể được xác nhận qua hệ thống open banking (webhook) hoặc bạn có thể duyệt thủ công.",
              "Ngoài ra toàn bộ các giao dịch phát sinh trên tài khoản nhóm sẽ được hệ thống ghi lại vào lịch sử giao dịch và bạn sẽ không thể xóa nó.",
            ]}
          />
          <RuleSection
            title="Đối với thành viên"
            icon="people"
            iconColor={Colors.colors.green}
            items={[
              <>
                Việc tham gia nhóm đồng nghĩa với việc,{" "}
                <Text className="font-bold text-primary">
                  đồng ý toàn bộ điều khoản do trưởng nhóm quy định.
                </Text>
              </>,
              "Trưởng nhóm sẽ có toàn quyền quyết định các giao dịch trên nhóm.",
              "Giao dịch nạp / rút quỹ được xác nhận thông qua hệ thống open banking hoặc trưởng nhóm sẽ xác nhận.",
            ]}
          />
          <RuleSection
            title="Về mục tiêu nhóm"
            icon="flag"
            iconColor={Colors.colors.pink}
            items={[
              "Chỉ trưởng nhóm mới có quyền quản lý mục tiêu nhóm.",
              "Trưởng nhóm chỉ có thể cập nhật mục tiêu nhóm khi chưa đến hạn.",
              <>
                Mục tiêu nhóm sẽ tự chuyển sang trạng thái
                <Text className="font-bold text-green"> Đã hoàn thành </Text>
                sau khi ghi nhận đã đạt hoặc
                <Text className="font-bold text-red"> Chưa hoàn thành </Text>
                nếu nó đã hết hạn.
              </>,
            ]}
          />
        </>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

interface RuleSectionProps {
  title: string;
  icon: string;
  iconColor: string;
  items: (string | React.ReactNode)[];
}

const RuleSection = ({ title, icon, iconColor, items }: RuleSectionProps) => {
  return (
    <View className="mb-6 overflow-hidden rounded-2xl bg-white shadow-md">
      <View
        className="border-l-4 px-5 py-4"
        style={{ borderLeftColor: iconColor }}
      >
        <View className="flex-row items-center">
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Ionicons name={icon as any} size={22} color={iconColor} />
          </View>
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
        </View>
      </View>

      <View className="h-px bg-gray-100" />

      <View className="p-5">
        {items.map((item, index) => (
          <View key={index} className="mb-4 flex-row last:mb-0">
            <View className="mr-3 mt-1.5">
              <View
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: iconColor }}
              />
            </View>
            <Text className="flex-1 text-base leading-6 text-gray-700">
              {typeof item === "string" ? item : item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default GroupRule;
