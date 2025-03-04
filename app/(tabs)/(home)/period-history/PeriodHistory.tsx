import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatListCustom, SafeAreaViewCustom, SectionComponent } from '@/components';
import usePeriodHistory from './hooks/usePeriodHistory';
import ChartSection from './components/ChartSection';
import TEXT_TRANSLATE_PERIOD_HISTORY from './PeriodHistory.translate';

export interface Transaction {
	id: string;
	subcategory: string;
	amount: string;
	type: 'income' | 'expense';
	date: string;
	time: string;
	icon: string;
}

export default function PeriodHistory() {
	const { state, handler } = usePeriodHistory();
	const { transactions, modelDetails, isLoading, isModelLoading } = state;

	const renderTransactionItem = ({ item }: { item: Transaction }) => (
		<View className="flex-row justify-between items-center py-4 border-b border-[#f0f0f0]">
			<View className="flex-row gap-3 items-center">
				<View className="w-12 h-12 rounded-full bg-[#f5f5f5] items-center justify-center">
					<MaterialIcons
						name={item.icon as any}
						size={24}
						color="#609084"
					/>
				</View>
				<View className="gap-1">
					<Text className="text-base font-medium text-black">
						{item.subcategory}
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
				{item.type === 'income' ? '+' : '-'}{handler.formatCurrency(Number(item.amount))}
			</Text>
		</View>
	);

	const renderListHeader = () => (
		<>
			{/* BALANCE SECTION */}
			<View className="items-center mb-4">
				<Text className="text-base text-[#929292]">
					{TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.BALANCE}
				</Text>
				<Text className="text-3xl font-semibold text-[#609084] mt-2">
					{handler.formatCurrency(modelDetails.balance)}
				</Text>
			</View>

			{/* STATISTIC SECTION */}
			<SectionComponent rootClassName="bg-white mx-4 mb-4 p-4 rounded-lg">
				<View className="flex-row justify-between items-center mb-4">
					<Text className="text-lg font-semibold text-[#609084]">
						{TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.STATISTICS}
					</Text>
				</View>

				{/* Income/Expense Summary */}
				<View className="flex-row justify-between mb-4">
					<View className="items-center">
						<Text className="text-[#929292]">Thu nhập</Text>
						<Text className="text-lg font-semibold text-[#00a010]">
							{handler.formatCurrency(modelDetails.income)}
						</Text>
					</View>
					<View className="items-center">
						<Text className="text-[#929292]">Chi tiêu</Text>
						<Text className="text-lg font-semibold text-[#cc0000]">
							{handler.formatCurrency(modelDetails.expense)}
						</Text>
					</View>
				</View>

				{/* Placeholder for Chart */}
				<ChartSection
					modelDetails={state.modelDetails}
					formatCurrency={handler.formatCurrency}
				/>
			</SectionComponent>

			{/* TRANSACTIONS HEADER */}
			<View className="flex-row justify-between items-center px-4 mb-4">
				<Text className="text-lg font-semibold text-[#609084]">
					{TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TRANSACTIONS}
				</Text>
				<Pressable onPress={handler.navigateToPeriodHistoryDetail}>
					<Text className="text-base text-[#609084]">
						{TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.SEE_MORE}
					</Text>
				</Pressable>
			</View>
		</>
	);

	const renderEmptyList = () => (
		<View className="flex-1 items-center justify-center py-8">
			<Text className="text-base text-gray-500">
				{isLoading
					? TEXT_TRANSLATE_PERIOD_HISTORY.MESSAGE_STATUS.LOADING_DATA
					: state.error
						? TEXT_TRANSLATE_PERIOD_HISTORY.MESSAGE_STATUS.ERROR_LOADING_DATA
						: TEXT_TRANSLATE_PERIOD_HISTORY.MESSAGE_STATUS.NO_TRANSACTIONS}
			</Text>
		</View>
	);

	if (isLoading || isModelLoading) {
		return (
			<SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
				<SectionComponent rootClassName="h-24 bg-white justify-center">
					<View className="flex-row items-center justify-between px-4">
						<Pressable onPress={handler.handleBack}>
							<MaterialIcons name="arrow-back" size={24} color="black" />
						</Pressable>
						<Text className="text-xl font-semibold text-black">
							{TEXT_TRANSLATE_PERIOD_HISTORY.LABELS.LOADING}
						</Text>
						<View style={{ width: 24 }} />
					</View>
				</SectionComponent>

				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#609084" />
					<Text className="mt-2 text-[#609084]">{TEXT_TRANSLATE_PERIOD_HISTORY.MESSAGE_STATUS.LOADING_DATA}</Text>
				</View>
			</SafeAreaViewCustom>
		);
	}

	return (
		<SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
			{/* HEADER */}
			<SectionComponent rootClassName="h-14 bg-white justify-center">
				<View className="flex-row items-center justify-between px-5">
					<Pressable onPress={handler.handleBack}>
						<MaterialIcons name="arrow-back" size={24} color="#609084" />
					</Pressable>
					<Text className="text-lg font-bold text-primary">
						{modelDetails.period}
					</Text>
					<View style={{ width: 24 }} />
				</View>
			</SectionComponent>

			{/* TRANSACTION LIST WITH HEADER COMPONENTS */}
			<FlatListCustom
				data={transactions as any}
				renderItem={renderTransactionItem}
				keyExtractor={item => item.id}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={renderListHeader}
				ListEmptyComponent={renderEmptyList}
				contentContainerStyle={{
					flexGrow: 1,
					paddingBottom: 24,
					backgroundColor: '#fafafa',
					paddingTop: 8
				}}
				className="flex-1 bg-white mx-4 rounded-lg"
				ItemSeparatorComponent={() => <View className="mx-4" />}
				refreshing={isLoading}
				onRefresh={handler.refetchData}
			/>
		</SafeAreaViewCustom>
	);
}