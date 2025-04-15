import React from 'react';
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, ScrollView, View, Pressable, Image } from "react-native";
import useAllTimeReport from './hooks/useAllTimeReport';
import TEXT_TRANSLATE_ALL_TIME_REPORT from './AllTimeReport.translate';
import { formatCurrency } from '@/helpers/libs';

const AllTimeReport = () => {

    const { state, handler } = useAllTimeReport();

    return (
        <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
            <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center">
                <View className="flex-row items-center justify-between px-4">
                    <Pressable onPress={handler.handleBack} className="p-2">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <Text className="text-lg font-bold text-gray-900">
                        {TEXT_TRANSLATE_ALL_TIME_REPORT.TITLE.ALL_TIME_REPORT}
                    </Text>
                    <View className="p-2" style={{ width: 24 }} />
                </View>
            </SectionComponent>

            <ScrollView className="flex-1">
                <View className="mt-4 bg-white mx-4 rounded-lg overflow-hidden">
                    {state?.financialSummary && Object.entries(state?.financialSummary)?.map(([key, value], index, arr) => (
                        <View
                            key={key}
                            className={`flex-row justify-between px-4 py-4 ${index !== arr.length - 1 ? 'border-b border-gray-200' : ''
                                }`}
                        >
                            <Text className="text-base font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                            <Text className="text-base font-medium text-gray-900">{formatCurrency(value)}</Text>
                        </View>
                    ))}

                </View>

                <View className="mt-4 flex-row flex-wrap justify-center">
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <View key={index} className="w-1/5 h-16 items-center">
                            <Image
                                source={{ uri: '/api/placeholder/80/80' }}
                                style={{ width: 60, height: 60 }}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaViewCustom>
    );
};

export default AllTimeReport;