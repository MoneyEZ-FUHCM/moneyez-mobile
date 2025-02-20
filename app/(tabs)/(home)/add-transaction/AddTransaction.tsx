import {
  DatePickerComponent,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import CategoryItem from "@/components/InvidualScreenCustom/CategoryItem";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { TransactionType } from "@/types/invidual.types";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import * as Yup from "yup";
import ADD_TRANSACTION_CONSTANTS from "./AddTransaction.const";
import useUploadImage from "@/hooks/useUploadImage";

const validationSchema = Yup.object().shape({
  amount: Yup.string().required("Số tiền không được để trống"),
  dob: Yup.string().required("Số tiền không được để trống"),
  description: Yup.string().required("Mô tả không được để trống"),
});

export default function AddTransaction() {
  const { type } = useLocalSearchParams();

  const INCOME = "income";
  const EXPENSE = "expense";
  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === INCOME ? INCOME : EXPENSE,
  );

  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("Tiền ăn");

  const handleBack = () => {
    router.back();
  };

  const initialValues = {
    amount: "",
    description: "",
    dob: "",
  };

  const { pickAndUploadImage, imageUrl } = useUploadImage();
  const [images, setImages] = useState<string[]>([]);
  console.log("check images", images);
  useEffect(() => {
    if (imageUrl) {
      setImages((prev) => [...prev, imageUrl]);
    }
  }, [imageUrl]);

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            Thêm chi tiêu / khoản thu
          </Text>
          <MaterialIcons name="camera-alt" size={24} color="#609084" />
        </View>
      </SectionComponent>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log({
            transactionType,
            amount: values.amount,
            date: date.toLocaleDateString("vi-VN"),
            description: values.description,
            selectedCategory,
            dob: values.dob,
            image: images,
          });
        }}
      >
        {({ handleSubmit }) => (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Transaction Type Selection */}
            <SectionComponent rootClassName="mx-5 mt-8 ">
              <View className="flex flex-row items-center space-x-4">
                {/* Chi tiêu */}
                <Pressable
                  onPress={() => setTransactionType("expense")}
                  className={`flex h-16 flex-1 flex-row items-center rounded-lg border-[0.5px] bg-white p-4 ${
                    transactionType === "expense"
                      ? "border border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <RadioButton.Android
                    value="expense"
                    status={
                      transactionType === "expense" ? "checked" : "unchecked"
                    }
                    onPress={() => setTransactionType("expense")}
                    color="#609084"
                    uncheckedColor="gray"
                  />
                  <SpaceComponent width={5} />
                  <Text
                    className={`text-base font-semibold ${
                      transactionType === "expense"
                        ? "text-[#609084]"
                        : "text-gray-500"
                    }`}
                  >
                    Chi tiêu
                  </Text>
                </Pressable>

                {/* Thu nhập */}
                <Pressable
                  onPress={() => setTransactionType("income")}
                  className={`flex h-16 flex-1 flex-row items-center rounded-lg border-[0.5px] bg-white p-4 ${
                    transactionType === "income"
                      ? "border border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <RadioButton.Android
                    value="income"
                    status={
                      transactionType === "income" ? "checked" : "unchecked"
                    }
                    onPress={() => setTransactionType("income")}
                    color="#609084"
                    uncheckedColor="gray"
                  />
                  <SpaceComponent width={5} />
                  <Text
                    className={`text-base font-semibold ${
                      transactionType === "income"
                        ? "text-[#609084]"
                        : "text-gray-500"
                    }`}
                  >
                    Thu nhập
                  </Text>
                </Pressable>
              </View>
            </SectionComponent>

            {/* THÔNG TIN SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
              <Text className="mb-3 text-base font-semibold text-[#609084]">
                Thông tin
              </Text>
              <InputComponent
                name="amount"
                label="Số tiền"
                placeholder="0 ₫"
                inputMode="numeric"
                isRequired
                labelClass="text-black text-sm font-semibold"
              />
              <SpaceComponent height={10} />
              <DatePickerComponent
                isRequired
                label="Ngày"
                name="dob"
                labelClass="text-black text-sm font-semibold"
              />
              <SpaceComponent height={10} />
              <TextAreaComponent
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả..."
                numberOfLines={6}
                isRequired
                labelClass="text-black text-sm font-semibold"
              />
            </SectionComponent>

            {/* PHÂN LOẠI SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-[#609084]">
                  Phân loại
                </Text>
                <Text className="text-sm text-[#757575]">Xem thêm &gt;</Text>
              </View>
              <View className="flex-row flex-wrap">
                {ADD_TRANSACTION_CONSTANTS.CATEGORIES.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategory(category.label)}
                    className="mb-3 w-1/3 px-1.5"
                  >
                    <CategoryItem
                      label={category.label}
                      color={category.color}
                      iconName={
                        category.icon as keyof typeof MaterialIcons.glyphMap
                      }
                      isSelected={selectedCategory === category.label}
                    />
                  </Pressable>
                ))}
              </View>
            </SectionComponent>

            {/* ẢNH HÓA ĐƠN SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Text className="mb-2 text-lg font-semibold text-[#609084]">
                Ảnh hóa đơn
              </Text>
              <View className="flex-row flex-wrap">
                {images.map((image, index) => (
                  <View
                    key={index}
                    className="relative mb-4 mr-4 h-20 w-[70px] overflow-hidden rounded-lg border border-[#ccc]"
                  >
                    <Image
                      source={{ uri: image }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
                <Pressable
                  onPress={pickAndUploadImage}
                  className="relative h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-[#ccc]"
                >
                  <MaterialIcons
                    name="add-circle-outline"
                    size={40}
                    color="#ccc"
                  />
                </Pressable>
              </View>
            </SectionComponent>

            {/* SUBMIT BUTTON */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Pressable
                onPress={() => handleSubmit()}
                className="h-12 w-full items-center justify-center rounded-lg bg-[#609084]"
              >
                <Text className="text-base font-semibold text-white">
                  {transactionType === "expense"
                    ? "Thêm chi tiêu"
                    : "Thêm thu nhập"}
                </Text>
              </Pressable>
            </SectionComponent>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
}
