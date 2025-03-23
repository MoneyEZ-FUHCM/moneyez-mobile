import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import {
  FlatListCustom,
  InputComponent,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { AntDesign, Feather } from "@expo/vector-icons";
import TEXT_TRANSLATE_ACCOUNT from "../AccountScreen.translate";
import useBankAccount from "./hooks/useBankAccount";
import { Modalize } from "react-native-modalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Formik } from "formik";

interface BankAccountType {
  id: number;
  accountNumber: string;
  bankName: string;
  bankShortName: string;
  accountHolderName: string;
}

interface BankType {
  id: number;
  code: string;
  name: string;
  swiftCode: string;
}

interface NewAccountType {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  bankShortName: string;
}

interface BankCardProps {
  item: BankAccountType;
  onPress: () => void;
}

const BankAccount = () => {
  const { state, handler } = useBankAccount();
  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([
    {
      id: 1,
      accountNumber: "123456789",
      bankName: "Ngân hàng TMCP Á Châu (ACB)",
      bankShortName: "ACB",
      accountHolderName: "Nguyễn Văn A",
    },
    {
      id: 2,
      accountNumber: "987654321",
      bankName: "Ngân hàng TMCP Ngoại Thương Việt Nam (VietcomBank)",
      bankShortName: "VCB",
      accountHolderName: "Trần Thị B",
    },
  ]);

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

  const [selectedAccount, setSelectedAccount] =
    useState<BankAccountType | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showBankSelect, setShowBankSelect] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const modalizeRef = useRef<Modalize>(null);
  const detailModalRef = useRef<Modalize>(null);
  const bankSelectModalRef = useRef<Modalize>(null);

  const [newAccount, setNewAccount] = useState<NewAccountType>({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    bankShortName: "",
  });

  const filteredBanks = BANK_LIST.filter((bank) =>
    bank.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleAddBankAccount = () => {
    modalizeRef.current?.open();
  };

  const handleViewDetail = (account: BankAccountType) => {
    setSelectedAccount(account);
    setShowDetail(true);
    detailModalRef.current?.open();
  };

  const handleOpenBankSelect = () => {
    setSearchText("");
    setShowBankSelect(true);
    bankSelectModalRef.current?.open();
  };

  const handleSelectBank = (bank: BankType) => {
    setSelectedBank(bank);
    setNewAccount({
      ...newAccount,
      bankName: bank.name,
      bankShortName: bank.code,
    });
    bankSelectModalRef.current?.close();
  };

  const handleConfirmAdd = () => {
    if (
      newAccount.bankName &&
      newAccount.accountNumber &&
      newAccount.accountHolderName
    ) {
      const newBankAccount = {
        id: Date.now(),
        bankName: newAccount.bankName,
        accountNumber: newAccount.accountNumber,
        accountHolderName: newAccount.accountHolderName,
        bankShortName: newAccount.bankShortName || "N/A",
      };

      setBankAccounts([...bankAccounts, newBankAccount]);
      setNewAccount({
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
        bankShortName: "",
      });
      setSelectedBank(null);
      modalizeRef.current?.close();
    }
  };

  const handleDeleteAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter((account) => account.id !== id));
    detailModalRef.current?.close();
  };

  const BankCard: React.FC<BankCardProps> = ({ item, onPress }) => {
    const colors = ["#609084", "#4A6FA5", "#6C5CE7", "#00B894", "#F39C12"];
    const colorIndex = item.id % colors.length;

    return (
      <TouchableOpacity
        className="mb-4 overflow-hidden rounded-xl bg-white shadow"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View className="p-4">
          <View className="flex-row items-center">
            <View
              className="mr-4 h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: colors[colorIndex] }}
            >
              <Text className="text-base font-bold text-white">
                {item.bankShortName}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {item.bankName}
              </Text>
              <Text className="mt-1 flex-row items-center text-sm text-gray-600">
                <Text className="mr-1 text-gray-400">Chủ TK:</Text>{" "}
                {item.accountHolderName}
              </Text>
              <View className="mt-2 flex-row items-center">
                <View className="rounded-md bg-gray-100 px-2 py-1">
                  <Text className="text-sm font-medium text-gray-700">
                    {item.accountNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  className="ml-2 p-1"
                  onPress={(e) => {
                    e.stopPropagation();
                    // Xử lý copy số tài khoản
                  }}
                >
                  <Feather name="copy" size={16} color="#609084" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              className="p-2"
              onPress={(e) => {
                e.stopPropagation();
                handleViewDetail(item);
              }}
            >
              <Feather name="more-vertical" size={20} color="#777" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row border-t border-gray-100">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3"
            onPress={(e) => {
              e.stopPropagation();
              // Xử lý chỉnh sửa
            }}
          >
            <Feather name="edit-2" size={16} color="#609084" />
            <Text className="ml-2 text-sm font-medium text-gray-700">
              Chỉnh sửa
            </Text>
          </TouchableOpacity>
          <View className="w-px bg-gray-100" />
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3"
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteAccount(item.id);
            }}
          >
            <Feather name="trash-2" size={16} color="#FF6B6B" />
            <Text className="ml-2 text-sm font-medium text-gray-700">Xóa</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const AccountDetail = () => {
    if (!selectedAccount) return null;

    const colors = ["#609084", "#4A6FA5", "#6C5CE7", "#00B894", "#F39C12"];
    const colorIndex = selectedAccount.id % colors.length;

    return (
      <ScrollView className="p-6">
        <View className="mb-6 items-center">
          <View
            className="mb-4 h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: colors[colorIndex] }}
          >
            <Text className="text-2xl font-bold text-white">
              {selectedAccount.bankShortName}
            </Text>
          </View>
          <Text className="text-center text-2xl font-bold text-gray-900">
            {selectedAccount.bankName}
          </Text>
        </View>

        <View className="mb-6 rounded-xl bg-gray-50 p-5">
          <View className="mb-4">
            <Text className="mb-1 text-sm text-gray-500">Số tài khoản</Text>
            <View className="flex-row items-center">
              <Text className="text-lg font-semibold text-gray-800">
                {selectedAccount.accountNumber}
              </Text>
              <TouchableOpacity className="ml-2 rounded-full bg-white p-1">
                <Feather name="copy" size={16} color="#609084" />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-gray-500">Chủ tài khoản</Text>
            <Text className="text-lg font-semibold text-gray-800">
              {selectedAccount.accountHolderName}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const BankSelectItem = ({ item, onSelect }) => {
    return (
      <TouchableOpacity
        className="border-b border-gray-100 px-6 py-4"
        onPress={() => onSelect(item)}
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

  const BankSelectModal = () => {
    return (
      <View className="h-full pb-6">
        <View className="border-b border-gray-200 px-6 py-4">
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

        <FlatList
          data={filteredBanks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BankSelectItem item={item} onSelect={handleSelectBank} />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center p-8">
              <Text className="text-center text-gray-500">
                Không tìm thấy ngân hàng phù hợp
              </Text>
            </View>
          }
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
        {/* Header */}
        <SectionComponent rootClassName="flex-row items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
          <TouchableOpacity
            onPress={handler.handleBack}
            className="h-11 w-10 items-center justify-center rounded-full"
          >
            <AntDesign name="arrowleft" size={22} color="#609084" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            {TEXT_TRANSLATE_ACCOUNT.TITLE.BANK_ACCOUNT || "Tài khoản ngân hàng"}
          </Text>
          <View className="w-10" />
        </SectionComponent>

        <FlatListCustom
          data={bankAccounts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <BankCard item={item} onPress={() => handleViewDetail(item)} />
          )}
          ListEmptyComponent={
            <View className="mt-10 items-center justify-center p-6">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Feather name="credit-card" size={32} color="#609084" />
              </View>
              <Text className="text-center text-lg text-gray-500">
                Chưa có tài khoản ngân hàng nào
              </Text>
              <Text className="mt-2 text-center text-gray-400">
                Nhấn nút bên dưới để thêm tài khoản mới
              </Text>
            </View>
          }
        />

        <View className="px-6 py-6">
          <TouchableOpacity
            onPress={handleAddBankAccount}
            className="flex-row items-center justify-center rounded-xl bg-[#609084] px-6 py-4 shadow"
          >
            <AntDesign name="plus" size={18} color="#fff" />
            <Text className="ml-2 text-base font-semibold text-white">
              Thêm tài khoản ngân hàng
            </Text>
          </TouchableOpacity>
        </View>

        <ModalLizeComponent ref={modalizeRef} modalStyle={{}}>
          <View className="rounded-t-3xl bg-white p-6">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-800">
                Thêm tài khoản ngân hàng
              </Text>
              <TouchableOpacity
                onPress={() => modalizeRef.current?.close()}
                className="h-8 w-8 items-center justify-center rounded-full bg-gray-100"
              >
                <AntDesign name="close" size={16} color="#555" />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={{
                accountNumber: "",
                bankName: selectedBank?.name || "",
                bankShortName: selectedBank?.code || "",
                accountHolderName: "",
              }}
              validationSchema={() => {}}
              onSubmit={() => {}}
            >
              {({ handleSubmit, setFieldValue, values }) => (
                <SectionComponent>
                  <InputComponent
                    name={"accountNumber"}
                    label={"Số tài khoản"}
                    placeholder={"Nhập số tài khoản"}
                    labelClass="text-text-gray text-sm"
                    inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                  />

                  {/* Ngân hàng select */}
                  <View className="mb-4">
                    <Text className="mb-1 text-sm text-text-gray">
                      Ngân hàng
                    </Text>
                    <TouchableOpacity
                      className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                      onPress={handleOpenBankSelect}
                    >
                      <Text
                        className={
                          selectedBank ? "text-gray-800" : "text-gray-400"
                        }
                      >
                        {selectedBank ? selectedBank.name : "Chọn ngân hàng"}
                      </Text>
                      <Feather name="chevron-down" size={18} color="#777" />
                    </TouchableOpacity>
                  </View>

                  <InputComponent
                    name={"accountHolderName"}
                    label={"Tên chủ tài khoản"}
                    placeholder={"Nhập tên chủ tài khoản"}
                    labelClass="text-text-gray text-sm"
                    inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                  />

                  <TouchableOpacity
                    className="mt-2 rounded-xl bg-[#609084] py-4 shadow-sm"
                    onPress={handleConfirmAdd}
                  >
                    <Text className="text-center text-base font-bold text-white">
                      Xác nhận
                    </Text>
                  </TouchableOpacity>
                </SectionComponent>
              )}
            </Formik>
          </View>
        </ModalLizeComponent>

        {/* Modal Detail */}
        <ModalLizeComponent
          ref={detailModalRef}
          modalStyle={{}}
          HeaderComponent={
            showDetail && selectedAccount ? (
              <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
                <TouchableOpacity
                  onPress={() => detailModalRef.current?.close()}
                  className="h-11 w-10 items-center justify-center rounded-full"
                >
                  <AntDesign name="arrowleft" size={22} color="#609084" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800">
                  Chi tiết tài khoản
                </Text>
                <View className="w-10" />
              </View>
            ) : null
          }
        >
          {showDetail && <AccountDetail />}
        </ModalLizeComponent>

        {/* Bank Select Modal */}
        <ModalLizeComponent
          ref={bankSelectModalRef}
          modalStyle={{}}
          HeaderComponent={
            <View className="flex-row items-center justify-between px-6 pb-2 pt-4">
              <TouchableOpacity
                onPress={() => bankSelectModalRef.current?.close()}
                className="h-11 w-10 items-center justify-center rounded-full"
              >
                <AntDesign name="arrowleft" size={22} color="#609084" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-800">
                Danh sách ngân hàng
              </Text>
              <View className="w-10" />
            </View>
          }
        >
          {showBankSelect && <BankSelectModal />}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default BankAccount;
