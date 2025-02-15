import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { RadioButton } from 'react-native-ui-lib';
import CategoryItem from '@/components/InvidualScreenCustom/CategoryItem';
import { SafeAreaViewCustom } from '@/components';
import ADD_TRANSACTION_CONSTANTS, { TransactionType } from './AddTransaction.const';
import { MaterialIcons } from '@expo/vector-icons';

export default function AddTransaction() {
  const navigation = useNavigation();
  const { type } = useLocalSearchParams();
  // Form state
  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === 'income' ? 'income' : 'expense'
  );
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('04/01/2025');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tiền ăn');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    // Process submission
    console.log({ transactionType, amount, date, description, selectedCategory });
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View className="h-24 bg-white justify-center">
          <View className="flex-row items-center justify-between px-4">
            <Pressable onPress={handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-xl font-semibold text-black">
              Thêm chi tiêu / khoản thu
            </Text>
            <MaterialIcons name="camera-alt" size={24} color="#609084" />
          </View>
        </View>

        <View className="flex flex-row items-center justify-center mx-4 space-x-4 my-4">
          {/* Chi tiêu */}
            <Pressable
            onPress={() => setTransactionType('expense')}
            className="flex-1 flex flex-row items-center border border-[#609084] rounded-lg p-4 h-16 bg-white"
            >
            <RadioButton
              value="expense"
              selected={transactionType === 'expense'}
              onPress={() => setTransactionType('expense')}
              size={24}
              className='mr-2'
            />
            <Text className="text-base font-semibold text-[#609084]">Chi tiêu</Text>
            </Pressable>

          {/* Thu nhập */}
          <Pressable
            onPress={() => setTransactionType('income')}
            className="flex-1 flex flex-row items-center border border-[#609084] rounded-lg p-4 h-16 bg-white"
          >
            <RadioButton
              value="income"
              selected={transactionType === 'income'}
              onPress={() => setTransactionType('income')}
              size={24}
              className='mr-2'
            />
            <Text className="text-base font-semibold text-[#609084]">Thu nhập</Text>
          </Pressable>
        </View>

        {/* THÔNG TIN SECTION */}
        <View className="bg-white m-4 p-4 rounded-lg">
          <Text className="text-lg font-semibold text-[#609084] mb-2">Thông tin</Text>

          {/* Số tiền */}
          <Text className="text-sm font-semibold text-black mb-1">Số tiền</Text>
          <TextInput
            placeholder="100.000 VNĐ"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            className="border border-[#ccc] rounded-lg px-3 py-2 mb-3"
          />

          {/* Ngày */}
          <Text className="text-sm font-semibold text-black mb-1">Ngày</Text>
          <View className="flex-row items-center mb-3">
            <TextInput
              placeholder="dd/mm/yyyy"
              value={date}
              onChangeText={setDate}
              className="flex-1 border border-[#ccc] rounded-lg px-3 py-2"
            />
            <MaterialIcons
              name="calendar-today"
              size={24}
              color="#757575"
              style={{ marginLeft: 8 }}
            />
          </View>

          {/* Mô tả */}
          <Text className="text-sm font-semibold text-black mb-1">Mô tả</Text>
          <TextInput
            placeholder="Cơm tấm phúc lộc thọ"
            value={description}
            onChangeText={setDescription}
            multiline
            className="border border-[#ccc] rounded-lg px-3 py-2 h-20"
          />
        </View>

        {/* PHÂN LOẠI SECTION */}
        <View className="bg-white m-4 p-4 rounded-lg">
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
        </View>

        {/* ẢNH HÓA ĐƠN SECTION */}
        <View className="bg-white m-4 p-4 rounded-lg">
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
        </View>

        {/* SUBMIT BUTTON */}
        <View className="bg-white m-4 p-4 rounded-lg">
          <Pressable
            onPress={handleSubmit}
            className="w-full h-12 rounded-lg bg-[#609084] items-center justify-center"
          >
            <Text className="text-white text-base font-semibold">Thêm chi tiêu</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
}
