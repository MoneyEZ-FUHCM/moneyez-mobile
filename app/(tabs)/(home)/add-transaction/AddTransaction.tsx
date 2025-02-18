import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { RadioButton } from 'react-native-ui-lib';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CategoryItem from '@/components/InvidualScreenCustom/CategoryItem';
import { DatePickerComponent, InputComponent, SafeAreaViewCustom, SectionComponent, SpaceComponent } from '@/components';
import ADD_TRANSACTION_CONSTANTS from './AddTransaction.const';
import { MaterialIcons } from '@expo/vector-icons';
import { TransactionType } from '@/types/invidual.types';

const validationSchema = Yup.object().shape({
  amount: Yup.string().required('Số tiền không được để trống'),
  description: Yup.string().required('Mô tả không được để trống'),
});

export default function AddTransaction() {
  const navigation = useNavigation();
  const { type } = useLocalSearchParams();
  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === 'income' ? 'income' : 'expense'
  );
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState('Tiền ăn');

  const handleBack = () => {
    navigation.goBack();
  };

  const initialValues = {
    amount: '',
    description: '',
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log({
            transactionType,
            amount: values.amount,
            date: date.toLocaleDateString('vi-VN'),
            description: values.description,
            selectedCategory
          });
        }}
      >
        {({ handleSubmit }) => (
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            {/* HEADER */}
            <SectionComponent rootClassName="h-24 bg-white justify-center">
              <View className="flex-row items-center justify-between px-4">
                <Pressable onPress={handleBack}>
                  <MaterialIcons name="arrow-back" size={24} color="black" />
                </Pressable>
                <Text className="text-xl font-semibold text-black">
                  Thêm chi tiêu / khoản thu
                </Text>
                <MaterialIcons name="camera-alt" size={24} color="#609084" />
              </View>
            </SectionComponent>

            {/* Transaction Type Selection */}
            <SectionComponent rootClassName="mx-4 px-4">
              <View className="flex flex-row items-center space-x-4">
                {/* Chi tiêu */}
                <Pressable
                  onPress={() => setTransactionType('expense')}
                  className={`flex-1 flex flex-row items-center border border-[#609084] rounded-lg p-4 h-16 ${
                    transactionType === 'expense' ? 'bg-[#609084]' : 'bg-white'
                  }`}
                >
                  <RadioButton
                    value="expense"
                    selected={transactionType === 'expense'}
                    onPress={() => setTransactionType('expense')}
                    size={24}
                    color={transactionType === 'expense' ? '#ffffff' : '#609084'}
                    className="mr-2"
                  />
                  <Text
                    className={`text-base font-semibold ${
                      transactionType === 'expense' ? 'text-white' : 'text-[#609084]'
                    }`}
                  >
                    Chi tiêu
                  </Text>
                </Pressable>

                {/* Thu nhập */}
                <Pressable
                  onPress={() => setTransactionType('income')}
                  className={`flex-1 flex flex-row items-center border border-[#609084] rounded-lg p-4 h-16 ${
                    transactionType === 'income' ? 'bg-[#609084]' : 'bg-white'
                  }`}
                >
                  <RadioButton
                    value="income"
                    selected={transactionType === 'income'}
                    onPress={() => setTransactionType('income')}
                    size={24}
                    color={transactionType === 'income' ? '#ffffff' : '#609084'}
                    className="mr-2"
                  />
                  <Text
                    className={`text-base font-semibold ${
                      transactionType === 'income' ? 'text-white' : 'text-[#609084]'
                    }`}
                  >
                    Thu nhập
                  </Text>
                </Pressable>
              </View>
            </SectionComponent>

            {/* THÔNG TIN SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Text className="text-lg font-semibold text-[#609084] mb-2">Thông tin</Text>
              
              <InputComponent
                name="amount"
                label="Số tiền *"
                placeholder="0 ₫"
                inputMode="numeric"
                isRequired
                labelClass="text-black text-sm font-semibold"
              />
              <SpaceComponent height={10} />

              <Text className="text-sm font-semibold text-black mb-1">Ngày *</Text>
              <DatePickerComponent
                selectedDate={date}
                onChange={(selectedDate: Date) => {
                  setDate(selectedDate);
                }}
              />
              <SpaceComponent height={10} />

              <InputComponent
                name="description"
                label="Mô tả *"
                placeholder="Nhập mô tả"
                isRequired
                inputMode='text'
                labelClass="text-black text-sm font-semibold"
              />
            </SectionComponent>

            {/* PHÂN LOẠI SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-[#609084]">Phân loại</Text>
                <Text className="text-sm text-[#757575]">Xem thêm &gt;</Text>
              </View>
              <View className="flex-row flex-wrap justify-between">
                {ADD_TRANSACTION_CONSTANTS.CATEGORIES.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => setSelectedCategory(category.label)}
                    className="w-1/3"
                  >
                    <CategoryItem
                      label={category.label}
                      iconName={category.icon as keyof typeof MaterialIcons.glyphMap}
                      isSelected={selectedCategory === category.label}
                    />
                  </Pressable>
                ))}
              </View>
            </SectionComponent>

            {/* ẢNH HÓA ĐƠN SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Text className="text-lg font-semibold text-[#609084] mb-2">Ảnh hóa đơn</Text>
              <View className="flex-row">
                <View className="w-20 h-20 border border-[#ccc] rounded-lg overflow-hidden mr-4 relative">
                  <View className="absolute w-full h-full bg-gray-100" />
                </View>
                <Pressable
                  onPress={() => {
                    // Open image picker or add image functionality
                  }}
                  className="w-20 h-20 border border-[#ccc] rounded-lg overflow-hidden relative items-center justify-center"
                >
                  <MaterialIcons name="add-circle-outline" size={40} color="#ccc" />
                </Pressable>
              </View>
            </SectionComponent>

            {/* SUBMIT BUTTON */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Pressable
                onPress={() => handleSubmit()}
                className="w-full h-12 rounded-lg bg-[#609084] items-center justify-center"
              >
                <Text className="text-white text-base font-semibold">
                  {transactionType === 'expense' ? 'Thêm chi tiêu' : 'Thêm thu nhập'}
                </Text>
              </Pressable>
            </SectionComponent>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
}