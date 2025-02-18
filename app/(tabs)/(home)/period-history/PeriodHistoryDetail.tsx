import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatListCustom, SafeAreaViewCustom, SectionComponent } from '@/components';
import { router } from 'expo-router';
import { Transaction, SAMPLE_TRANSACTIONS } from './PeriodHistoryDetail.const';

export default function PeriodHistoryDetail() {
  const handleBack = () => {
    router.back();
  };

  const formatCurrency = (amount: string) => {
    try {
      const numericAmount = Number(amount.replace(/[^0-9.-]+/g, ''));
      if (isNaN(numericAmount)) return '0 ₫';
      
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(numericAmount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '0 ₫';
    }
  };

  const summaryData = useMemo(() => {
    let income = 0;
    let expense = 0;

    SAMPLE_TRANSACTIONS.forEach(transaction => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  }, [SAMPLE_TRANSACTIONS]);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View className="flex-row justify-between items-center py-4 border-b border-[#f0f0f0]">
      <View className="flex-row gap-3 items-center">
        <View className="w-12 h-12 rounded-full bg-[#f5f5f5] items-center justify-center">
          <MaterialIcons
            name={item.icon}
            size={24}
            color="#609084"
          />
        </View>
        <View className="gap-1">
          <Text className="text-base font-medium text-black">
            {item.category}
          </Text>
          <View className="flex-row gap-3">
            <Text className="text-xs text-[#929292]">{item.date}</Text>
            <Text className="text-xs text-[#929292]">{item.time}</Text>
          </View>
        </View>
      </View>
      <Text
        className={`text-base font-semibold ${
          item.type === 'income' ? 'text-[#00a010]' : 'text-[#cc0000]'
        }`}
      >
        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const EmptyListComponent = () => (
    <View className="flex-1 items-center justify-center py-8">
      <MaterialIcons name="receipt-long" size={48} color="#cccccc" />
      <Text className="text-base text-[#929292] mt-2">
        Không có giao dịch nào
      </Text>
    </View>
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-24 bg-white justify-center">
        <View className="flex-row items-center justify-between px-4">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-xl font-semibold text-black">
            Danh sách thu chi
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* SUMMARY SECTION */}
      <SectionComponent rootClassName="bg-white mx-4 mt-4 p-4 rounded-lg">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-[#929292]">Tổng thu</Text>
            <Text className="text-base font-semibold text-[#00a010]">
              +{formatCurrency(summaryData.income.toString())}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-[#929292]">Tổng chi</Text>
            <Text className="text-base font-semibold text-[#cc0000]">
              -{formatCurrency(summaryData.expense.toString())}
            </Text>
          </View>
          <View>
            <Text className="text-sm text-[#929292]">Số dư</Text>
            <Text className="text-base font-semibold text-[#609084]">
              {formatCurrency(summaryData.balance.toString())}
            </Text>
          </View>
        </View>
      </SectionComponent>

      {/* TRANSACTIONS LIST */}
      <SectionComponent rootClassName="flex-1 bg-white mx-4 mt-4 p-4 rounded-lg">
        <FlatListCustom
          data={SAMPLE_TRANSACTIONS}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyListComponent}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 16
          }}
        />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}