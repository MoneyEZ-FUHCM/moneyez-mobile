import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { appInfo } from "@/helpers/constants/appInfos";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight2, Bank, LogoutCurve, TagUser } from "iconsax-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_ACCOUNT from "../AccountScreen.translate";
import useAccountScreen from "./hooks/useAccountScreen";

const SETTING_OPTIONS = [
  {
    id: 1,
    icon: <TagUser size="20" color="white" variant="Bold" />,
    title: "Thông tin cá nhân",
    description: "Họ và tên, ảnh đại diện, ngày sinh,...",
  },
  {
    id: 2,
    icon: <Bank size="20" color="white" variant="Bold" />,
    title: "Tài khoản ngân hàng",
    description: "Số tài khoản, tên ngân hàng, chi nhánh,...",
  },
];

const AccountSetting = () => {
  const { handler, state } = useAccountScreen();

  return (
    <SafeAreaViewCustom>
      <SectionComponent
        rootClassName="bg-thirdly"
        style={{ height: appInfo.sizes.HEIGHT * 0.42 }}
      >
        <View className="flex-1 items-center justify-center gap-1">
          {state.userInfo?.avatarUrl ? (
            <Image
              source={{ uri: state.userInfo.avatarUrl }}
              className="mb-1 h-48 w-48 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={["#609084", "#4A7A70"]}
              className="h-48 w-48 items-center justify-center rounded-full shadow-md"
            >
              <Text className="mt-5 text-8xl font-semibold uppercase text-white">
                {state.userInfo?.fullName?.charAt(0)}
              </Text>
            </LinearGradient>
          )}

          <Text className="text-2xl font-semibold">
            {state?.userInfo?.fullName}
          </Text>
          <Text className="text-gray-500">{state?.userInfo?.email}</Text>
        </View>
      </SectionComponent>
      <SectionComponent
        rootClassName="flex-1 relative rounded-t-[40px]"
        style={{ height: appInfo.sizes.HEIGHT * 0.58 }}
      >
        <View className="mx-5 mt-5 items-center rounded-2xl bg-white py-3">
          {SETTING_OPTIONS.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="w-full flex-row items-center justify-between px-5 py-3"
              onPress={() => handler.handleNavigateAccountOptions(item?.id)}
            >
              <View
                className={`flex-row items-center gap-x-5 ${item.id === 2 ? "mt-2" : ""}`}
              >
                <View className="rounded-full bg-primary p-2">{item.icon}</View>
                <View>
                  <Text className="text-[15px] font-medium">{item.title}</Text>
                  <Text className="text-[12px] text-[#949494]">
                    {item.description}
                  </Text>
                </View>
              </View>
              <ArrowRight2 size="26" color="#9b9b9b" />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          className="mt-8 items-center"
          onPress={handler.handleLogout}
        >
          <View className="w-52 flex-row items-center justify-center gap-x-2 rounded-xl bg-white py-2">
            <LogoutCurve size="26" color="red" />
            <Text className="text-[15px] font-semibold">
              {TEXT_TRANSLATE_ACCOUNT.BUTTON.LOGOUT}
            </Text>
          </View>
        </TouchableOpacity>
        <View className="absolute -top-5 h-7 w-full rounded-t-[30px] bg-[#f2f2f2]" />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default AccountSetting;
