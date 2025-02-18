import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatListCustom, SafeAreaViewCustom, ScrollViewCustom, SectionComponent } from '@/components';
import { router } from 'expo-router';
import SAMPLE_TRANSACTIONS, { Transaction } from './PeriodHistory.const';
import { PATH_NAME } from '@/helpers/constants/pathname';

export default function PeriodHistory() {
  const { HOME } = PATH_NAME;


	const handleBack = () => {
		router.back();
	};

	const formatCurrency = (amount: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(parseInt(amount));
	};

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
				className={`text-base font-semibold ${item.type === 'income' ? 'text-[#00a010]' : 'text-[#cc0000]'
					}`}
			>
				{item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
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
						01/01/2025 - 01/02/2025
					</Text>
					<View style={{ width: 24 }} />
				</View>
			</SectionComponent>

			{/* BALANCE SECTION */}
			<View className="items-center">
				<Text className="text-base text-[#929292]">
					Tổng số dư kỳ này của bạn
				</Text>
				<Text className="text-3xl font-semibold text-[#609084] mt-2">
					{formatCurrency('100000')}
				</Text>
			</View>

			<ScrollViewCustom
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: 24,
					backgroundColor: '#fafafa'
				}}
			>
				{/* STATISTIC SECTION */}
				<SectionComponent rootClassName="bg-white mx-4 mb-4 p-4 rounded-lg">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-lg font-semibold text-[#609084]">
							Thống kê
						</Text>
					</View>

					{/* Placeholder for Chart */}
					<View className="h-[100px] bg-[#f5f5f5] rounded-lg" />
				</SectionComponent>

				{/* MewMo SECTION */}
				<SectionComponent rootClassName="bg-white mx-4 mb-4 p-4 rounded-lg">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-lg font-semibold text-[#609084]">
							MewMo
						</Text>
					</View>

					{/* Placeholder for Chart */}
					<View className="h-[100px] bg-[#f5f5f5] rounded-lg" />
				</SectionComponent>

				{/* TRANSACTIONS SECTION */}
				<SectionComponent rootClassName="flex-1 bg-white mx-4 p-4 rounded-lg">
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-lg font-semibold text-[#609084]">
							Các khoản thu chi
						</Text>
						<Pressable onPress={() => router.navigate(HOME.PERIOD_HISTORY_DETAIL as any)}>
							<Text className="text-base text-[#609084] italic">
								Xem thêm &gt;
							</Text>
						</Pressable>
					</View>
					<FlatListCustom
						data={SAMPLE_TRANSACTIONS}
						renderItem={renderTransactionItem}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
					/>
				</SectionComponent>
			</ScrollViewCustom>
		</SafeAreaViewCustom>
	);
}