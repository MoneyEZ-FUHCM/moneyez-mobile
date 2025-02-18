import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaViewCustom, SectionComponent } from '@/components';
import { useNavigation } from 'expo-router';
import { TRANSACTION_HISTORY_CONSTANTS } from './TransactionHistory.const';

export default function TransactionHistory() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleBack = () => {
    navigation.goBack();
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(parseInt(amount));
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-24 bg-white justify-center">
        <View className="flex-row items-center justify-between px-4">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-xl font-semibold text-black">Lịch sử</Text>
          <View style={{ width: 24 }} /> {/* Placeholder for symmetry */}
        </View>
      </SectionComponent>

      {/* FILTER TABS */}
      <SectionComponent rootClassName="bg-white px-4 py-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {TRANSACTION_HISTORY_CONSTANTS.FILTER_TABS.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                className={`px-4 py-2 border rounded-2xl ${activeFilter === tab.id
                  ? 'bg-[#609084] border-[#609084]'
                  : 'border-[#609084] bg-white'
                  }`}
              >
                <Text
                  className={`text-base ${activeFilter === tab.id ? 'text-white' : 'text-[#609084]'
                    }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SectionComponent>

      {/* TRANSACTION LIST */}
      <ScrollView className="flex-1">
        {Object.entries(TRANSACTION_HISTORY_CONSTANTS.SAMPLE_TRANSACTIONS).map(([year, transactions]) => (
          <SectionComponent key={year} rootClassName="bg-white m-4 p-4 rounded-lg">
            <Text className="text-xl font-semibold text-[#021433] mb-4">{year}</Text>

            {transactions.map((transaction, index) => (
              <View
                key={index}
                className="border border-[#dbdbdb] rounded p-4 mb-3"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-semibold text-[#609084]">
                    {transaction.modelName}
                  </Text>
                  <Text className="text-base font-medium text-[#00a010]">
                    {formatCurrency(transaction.income)}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-sm italic text-[#021433]">
                    {transaction.period}
                  </Text>
                  <Text className="text-base font-medium text-[#cc0000]">
                    {formatCurrency(transaction.expense)}
                  </Text>
                </View>

                <Pressable className="flex items-end mt-2">
                  <Text className="text-sm italic text-[#609084] underline">
                    Xem chi tiết {'>'}
                  </Text>
                </Pressable>
              </View>
            ))}
          </SectionComponent>
        ))}
      </ScrollView>
    </SafeAreaViewCustom>
  );
}