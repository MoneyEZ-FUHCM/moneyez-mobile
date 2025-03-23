import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import {
  FlatListCustom,
  InputComponent,
  ModalLizeComponent,
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";
import { router, useFocusEffect } from "expo-router";
import { useDispatch } from "react-redux";
import { setMainTabHidden } from "@/redux/slices/tabSlice";

interface BankType {
  id: number;
  code: string;
  name: string;
  swiftCode: string;
}

import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AddBankAccountProps = NativeStackScreenProps<any, any>;

const AddBankAccount = ({ navigation, route }: AddBankAccountProps) => {
  // const { onAddAccount } = route.params;

  const BANK_LIST: BankType[] = [
    {
      id: 1,
      code: "ACB",
      name: "Ngân hàng TMCP Á Châu (ACB)",
      swiftCode: "ASCBVNVX",
    },
    {
      id: 2,
      code: "VietcomBank",
      name: "Ngân hàng TMCP Ngoại Thương Việt Nam (VietcomBank)",
      swiftCode: "BFTVVNVX",
    },
    {
      id: 3,
      code: "VietinBank",
      name: "Ngân hàng TMCP Công Thương Việt Nam (VietinBank)",
      swiftCode: "ICBVVNVX",
    },
    {
      id: 4,
      code: "Techcombank",
      name: "Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)",
      swiftCode: "VTCBVNVX",
    },
    {
      id: 5,
      code: "BIDV",
      name: "Ngân hàng TMCP Đầu Tư Và Phát Triển Việt Nam (BIDV)",
      swiftCode: "BIDVVNVX",
    },
    {
      id: 6,
      code: "MaritimeBank",
      name: "Ngân hàng TMCP Hàng Hải Việt Nam (MaritimeBank)",
      swiftCode: "MCOBVNVX",
    },
    {
      id: 7,
      code: "VPBank",
      name: "Ngân hàng Việt Nam Thịnh Vượng (VPBank)",
      swiftCode: "VPBKVNVX",
    },
    {
      id: 8,
      code: "Agribank",
      name: "Ngân hàng Nông nghiệp và Phát triển Việt Nam (Agribank)",
      swiftCode: "VBAAVNVX",
    },
    {
      id: 9,
      code: "Eximbank",
      name: "Ngân hàng TMCP Xuất nhập khẩu Việt Nam (Eximbank)",
      swiftCode: "EBVIVNVX",
    },
    {
      id: 10,
      code: "Sacombank",
      name: "Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)",
      swiftCode: "SGTTVNVX",
    },
  ];

  const [showBankSelect, setShowBankSelect] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const bankSelectModalRef = useRef<Modalize>(null);

  const filteredBanks = BANK_LIST.filter((bank) =>
    bank.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleOpenBankSelect = () => {
    setSearchText("");
    setShowBankSelect(true);
    bankSelectModalRef.current?.open();
  };

  const handleSelectBank = (
    bank: BankType,
    setFieldValue: (arg0: string, arg1: string) => void,
  ) => {
    setSelectedBank(bank);
    setFieldValue("bankName", bank.name);
    setFieldValue("bankShortName", bank.code);
    bankSelectModalRef.current?.close();
  };

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.string().required("Số tài khoản là bắt buộc"),
    bankName: Yup.string().required("Vui lòng chọn ngân hàng"),
    accountHolderName: Yup.string().required("Tên chủ tài khoản là bắt buộc"),
  });

  const handleSubmit = (values: any) => {
    // onAddAccount({
    //   accountNumber: values.accountNumber,
    //   bankName: values.bankName,
    //   bankShortName: values.bankShortName,
    //   accountHolderName: values.accountHolderName,
    // });
    navigation.goBack();
  };

  const BankSelectItem = ({
    item,
    onSelect,
    setFieldValue,
  }: {
    item: BankType;
    onSelect: (
      bank: BankType,
      setFieldValue: (field: string, value: any) => void,
    ) => void;
    setFieldValue: (field: string, value: any) => void;
  }) => {
    return (
      <TouchableOpacity
        className="border-b border-gray-100 px-6 py-4"
        onPress={() => onSelect(item, setFieldValue)}
      >
        <View className="flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Text className="font-bold text-gray-700">{item.code}</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-medium text-gray-800">{item.name}</Text>
            <Text className="text-sm text-gray-500">
              Swift: {item.swiftCode}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const BankSelectModal = ({
    setFieldValue,
  }: {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredBanks.length > 0 ? (
          filteredBanks.map((item) => (
            <BankSelectItem
              key={item.id.toString()}
              item={item}
              onSelect={handleSelectBank}
              setFieldValue={setFieldValue}
            />
          ))
        ) : (
          <View className="items-center justify-center p-8">
            <Text className="text-center text-gray-500">
              Không tìm thấy ngân hàng phù hợp
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
        {/* Header */}
        <SectionComponent rootClassName="flex-row items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-10 items-center justify-center rounded-full"
          >
            <AntDesign name="arrowleft" size={22} color="#609084" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Thêm tài khoản ngân hàng
          </Text>
          <View className="w-10" />
        </SectionComponent>

        <SectionComponent rootClassName="flex-1 p-6">
          <Formik
            initialValues={{
              accountNumber: "",
              bankName: selectedBank?.name || "",
              bankShortName: selectedBank?.code || "",
              accountHolderName: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => (
              <View>
                <InputComponent
                  name="accountNumber"
                  label="Số tài khoản"
                  placeholder="Nhập số tài khoản"
                  labelClass="text-text-gray text-sm"
                  inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                />

                {/* Ngân hàng select */}
                <View className="mb-4">
                  <Text className="mb-1 text-sm text-text-gray">Ngân hàng</Text>
                  <TouchableOpacity
                    className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                    onPress={handleOpenBankSelect}
                  >
                    <Text
                      className={
                        values.bankName ? "text-gray-800" : "text-gray-400"
                      }
                    >
                      {values.bankName ? values.bankName : "Chọn ngân hàng"}
                    </Text>
                    <Feather name="chevron-down" size={18} color="#777" />
                  </TouchableOpacity>
                  {touched.bankName && errors.bankName && (
                    <Text className="text-red-500 mt-1 text-sm">
                      {errors.bankName}
                    </Text>
                  )}
                </View>

                <InputComponent
                  name="accountHolderName"
                  label="Tên chủ tài khoản"
                  placeholder="Nhập tên chủ tài khoản"
                  labelClass="text-text-gray text-sm"
                  inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                />

                <TouchableOpacity
                  className="mt-6 rounded-xl bg-[#609084] py-4 shadow-sm"
                  onPress={() => handleSubmit()}
                >
                  <Text className="text-center text-base font-bold text-white">
                    Xác nhận
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </SectionComponent>

        {/* Bank Select Modal */}
        <ModalLizeComponent
          ref={bankSelectModalRef}
          HeaderComponent={
            <View className="border-b border-gray-200 bg-white px-6 py-4">
              <Text className="mb-2 text-lg font-bold text-gray-800">
                Chọn ngân hàng
              </Text>
              <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
                <Feather name="search" size={18} color="#777" />
                <TextInput
                  className="ml-2 flex-1 text-gray-700"
                  placeholder="Tìm kiếm ngân hàng..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {searchText ? (
                  <TouchableOpacity onPress={() => setSearchText("")}>
                    <Feather name="x" size={18} color="#777" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          }
        >
          {showBankSelect && (
            <Formik
              initialValues={{
                accountNumber: "",
                bankName: "",
                bankShortName: "",
                accountHolderName: "",
              }}
              onSubmit={() => {}}
            >
              {({ setFieldValue }) => (
                <BankSelectModal setFieldValue={setFieldValue} />
              )}
            </Formik>
          )}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default AddBankAccount;
