import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { User } from "iconsax-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_ACCOUNT from "../AccountScreen.translate";
import useAccountScreen from "../hooks/useAccountScreen";

const UpdateUserInfo = () => {
  const { state, handler } = useAccountScreen();
  const primary = "#609084";

  handler.handleHideTabbar();

  return (
    <SafeAreaViewCustom rootClassName="relative">
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4 ">
        <TouchableOpacity onPress={handler.handleBack}>
          <AntDesign
            name="arrowleft"
            size={24}
            color="#609084"
            style={{
              textShadowColor: "#609084",
              textShadowRadius: 2,
              textShadowOffset: { width: 1, height: 1 },
            }}
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          {TEXT_TRANSLATE_ACCOUNT.TITLE.ACCOUNT}
        </Text>
        <Text></Text>
      </SectionComponent>
      <SectionComponent rootClassName="my-4">
        <View className="items-center justify-center gap-2">
          <TouchableOpacity onPress={handler.pickAndUploadImage}>
            {state.imageUrl ? (
              <Image
                src={state.imageUrl}
                className="mb-1 h-28 w-28 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Image
                source={state?.userInfo?.avatarUrl ?? Admin}
                className="mb-1 h-28 w-28 rounded-full"
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
          <View className="items-center gap-[-2px]">
            <Text className="text-base font-semibold">Xin chào</Text>
            <Text className="text-xl font-normal text-gray-500">
              {state?.userInfo?.fullName}
            </Text>
          </View>
        </View>
      </SectionComponent>
      <SectionComponent rootClassName="mx-5">
        <View className="w-fit self-start">
          <Text className="border-b-2 border-primary py-0.5 text-[15px] text-primary">
            Tài khoản
          </Text>
        </View>
      </SectionComponent>
      <Formik
        initialValues={{
          email: "",
          fullName: "",
          password: "",
          phoneNumber: "",
          confirmPassword: "",
        }}
        validationSchema={() => {}}
        onSubmit={() => {}}
      >
        {({ handleSubmit }) => (
          <>
            <SectionComponent rootClassName="mt-5 mx-5">
              <InputComponent
                name={state.FORM_NAME.FULLNAME}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.FULLNAME}
                // placeholder={TITLE.ENTER_EMAIL}
                labelClass="text-text-gray text-[12px]"
                icon={<User size="18" color={primary} variant="Outline" />}
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={state.FORM_NAME.PHONE_NUMBER}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.PHONE_NUMBER}
                // placeholder={TITLE.ENTER_FULLNAME}
                labelClass="text-text-gray text-[12px]"
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={state.FORM_NAME.PHONE_NUMBER}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.PHONE_NUMBER}
                // placeholder={TITLE.ENTER_FULLNAME}
                labelClass="text-text-gray text-[12px]"
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={state.FORM_NAME.PHONE_NUMBER}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.PHONE_NUMBER}
                // placeholder={TITLE.ENTER_FULLNAME}
                labelClass="text-text-gray text-[12px]"
              />
            </SectionComponent>

            <SectionComponent rootClassName="absolute bottom-5 w-full">
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="mx-5 rounded-xl bg-primary py-2.5"
              >
                <Text className="text-center text-lg font-medium text-white">
                  Cập nhật
                </Text>
              </TouchableOpacity>
            </SectionComponent>
          </>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
};

export default UpdateUserInfo;
