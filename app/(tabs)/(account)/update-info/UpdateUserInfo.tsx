import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  DatePickerComponent,
  InputComponent,
  RadioGroupComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { Buildings, Call, User } from "iconsax-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_ACCOUNT from "../AccountScreen.translate";
import useUpdateUserInfo from "./hooks/useUpdateUserInfo";
import { LinearGradient } from "expo-linear-gradient";

const UpdateUserInfo = () => {
  const { state, handler } = useUpdateUserInfo();
  const primary = "#609084";

  return (
    <SafeAreaViewCustom rootClassName="relative bg-gray-50">
      <SectionComponent rootClassName="flex-row relative justify-center items-center bg-white h-14 px-4">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute bottom-[17px] left-4"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {TEXT_TRANSLATE_ACCOUNT.TITLE.ACCOUNT}
        </Text>
      </SectionComponent>
      <SectionComponent rootClassName="my-4">
        <View className="items-center justify-center gap-2">
          <TouchableOpacity onPress={handler.pickAndUploadImage}>
            {state.imageUrl ? (
              <Image
                source={{ uri: state.imageUrl }}
                className="mb-1 h-28 w-28 rounded-full"
                resizeMode="cover"
              />
            ) : state.userInfo?.avatarUrl ? (
              <Image
                source={{ uri: state.userInfo.avatarUrl }}
                className="mb-1 h-28 w-28 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <LinearGradient
                colors={["#609084", "#4A7A70"]}
                className="h-28 w-28 items-center justify-center rounded-full shadow-md"
              >
                <Text className="mt-3 text-5xl font-semibold uppercase text-white">
                  {state.userInfo?.fullName?.charAt(0)}
                </Text>
              </LinearGradient>
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

      <Formik
        enableReinitialize
        initialValues={{
          fullName: state.userInfo?.fullName ?? "",
          phoneNumber: state.userInfo?.phoneNumber ?? "",
          dob: state.userInfo?.dob ?? "",
          gender: state.userInfo?.gender ?? "",
          address: state.userInfo?.address ?? "",
        }}
        validationSchema={handler.updateValidationSchema}
        onSubmit={handler.handleUpdateInfo}
      >
        {({ handleSubmit }) => (
          <>
            <SectionComponent rootClassName="mt-5 mx-5">
              <InputComponent
                name={state.FORM_NAME.FULLNAME}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.FULLNAME}
                placeholder={TEXT_TRANSLATE_ACCOUNT.TITLE.ENTER_FULLNAME}
                labelClass="text-text-gray text-[12px]"
                isRequired
                icon={<User size="18" color={primary} variant="Outline" />}
              />
              <SpaceComponent height={5} />
              <InputComponent
                name={state.FORM_NAME.PHONE_NUMBER}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.PHONE_NUMBER}
                placeholder={TEXT_TRANSLATE_ACCOUNT.TITLE.ENTER_FULLNAME}
                labelClass="text-text-gray text-[12px]"
                isRequired
                icon={<Call size="18" color={primary} />}
              />
              <SpaceComponent height={5} />
              <InputComponent
                name={state.FORM_NAME.ADDRESS}
                label={TEXT_TRANSLATE_ACCOUNT.LABEL.ADDRESS}
                placeholder={TEXT_TRANSLATE_ACCOUNT.TITLE.ENTER_ADDRESS}
                labelClass="text-text-gray text-[12px]"
                icon={<Buildings size="18" color={primary} />}
              />
              <SpaceComponent height={5} />
              <View className="flex-row">
                <DatePickerComponent
                  name="dob"
                  label="Ngày sinh"
                  containerClass="flex-1 w-1/2"
                  labelClass="text-text-gray text-[12px]"
                  isRequired
                />
                <SpaceComponent width={25} />
                <RadioGroupComponent
                  orientation="horizontal"
                  containerClass="flex-1 w-1/2"
                  name="gender"
                  options={[
                    { label: "Nam", value: 0 },
                    { label: "Nữ", value: 1 },
                  ]}
                  label="Giới tính"
                  spacing={30}
                />
              </View>
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
