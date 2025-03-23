import {
  InputComponent,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { AntDesign, Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

interface BankType {
  id: number;
  code: string;
  name: string;
  swiftCode: string | null;
  bin: string;
  shortName: string;
  logo: string;
}
const BANK_LIST: BankType[] = [
  {
    id: 17,
    name: "Ngân hàng TMCP Công thương Việt Nam",
    code: "ICB",
    bin: "970415",
    shortName: "VietinBank",
    logo: "https://api.vietqr.io/img/ICB.png",
    swiftCode: "ICBVVNVX",
  },
  {
    id: 43,
    name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
    code: "VCB",
    bin: "970436",
    shortName: "Vietcombank",
    logo: "https://api.vietqr.io/img/VCB.png",
    swiftCode: "BFTVVNVX",
  },
  {
    id: 4,
    name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
    code: "BIDV",
    bin: "970418",
    shortName: "BIDV",
    logo: "https://api.vietqr.io/img/BIDV.png",
    swiftCode: "BIDVVNVX",
  },
  {
    id: 42,
    name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
    code: "VBA",
    bin: "970405",
    shortName: "Agribank",
    logo: "https://api.vietqr.io/img/VBA.png",
    swiftCode: "VBAAVNVX",
  },
  {
    id: 26,
    name: "Ngân hàng TMCP Phương Đông",
    code: "OCB",
    bin: "970448",
    shortName: "OCB",
    logo: "https://api.vietqr.io/img/OCB.png",
    swiftCode: "ORCOVNVX",
  },
  {
    id: 21,
    name: "Ngân hàng TMCP Quân đội",
    code: "MB",
    bin: "970422",
    shortName: "MBBank",
    logo: "https://api.vietqr.io/img/MB.png",

    swiftCode: "MSCBVNVX",
  },
  {
    id: 38,
    name: "Ngân hàng TMCP Kỹ thương Việt Nam",
    code: "TCB",
    bin: "970407",
    shortName: "Techcombank",
    logo: "https://api.vietqr.io/img/TCB.png",

    swiftCode: "VTCBVNVX",
  },
  {
    id: 2,
    name: "Ngân hàng TMCP Á Châu",
    code: "ACB",
    bin: "970416",
    shortName: "ACB",
    logo: "https://api.vietqr.io/img/ACB.png",

    swiftCode: "ASCBVNVX",
  },
  {
    id: 47,
    name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
    code: "VPB",
    bin: "970432",
    shortName: "VPBank",
    logo: "https://api.vietqr.io/img/VPB.png",

    swiftCode: "VPBKVNVX",
  },
  {
    id: 39,
    name: "Ngân hàng TMCP Tiên Phong",
    code: "TPB",
    bin: "970423",
    shortName: "TPBank",
    logo: "https://api.vietqr.io/img/TPB.png",

    swiftCode: "TPBVVNVX",
  },
  {
    id: 36,
    name: "Ngân hàng TMCP Sài Gòn Thương Tín",
    code: "STB",
    bin: "970403",
    shortName: "Sacombank",
    logo: "https://api.vietqr.io/img/STB.png",

    swiftCode: "SGTTVNVX",
  },
  {
    id: 12,
    name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh",
    code: "HDB",
    bin: "970437",
    shortName: "HDBank",
    logo: "https://api.vietqr.io/img/HDB.png",

    swiftCode: "HDBCVNVX",
  },
  {
    id: 44,
    name: "Ngân hàng TMCP Bản Việt",
    code: "VCCB",
    bin: "970454",
    shortName: "VietCapitalBank",
    logo: "https://api.vietqr.io/img/VCCB.png",

    swiftCode: "VCBCVNVX",
  },
  {
    id: 31,
    name: "Ngân hàng TMCP Sài Gòn",
    code: "SCB",
    bin: "970429",
    shortName: "SCB",
    logo: "https://api.vietqr.io/img/SCB.png",

    swiftCode: "SACLVNVX",
  },
  {
    id: 45,
    name: "Ngân hàng TMCP Quốc tế Việt Nam",
    code: "VIB",
    bin: "970441",
    shortName: "VIB",
    logo: "https://api.vietqr.io/img/VIB.png",

    swiftCode: "VNIBVNVX",
  },
  {
    id: 35,
    name: "Ngân hàng TMCP Sài Gòn - Hà Nội",
    code: "SHB",
    bin: "970443",
    shortName: "SHB",
    logo: "https://api.vietqr.io/img/SHB.png",

    swiftCode: "SHBAVNVX",
  },
  {
    id: 10,
    name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
    code: "EIB",
    bin: "970431",
    shortName: "Eximbank",
    logo: "https://api.vietqr.io/img/EIB.png",

    swiftCode: "EBVIVNVX",
  },
  {
    id: 22,
    name: "Ngân hàng TMCP Hàng Hải",
    code: "MSB",
    bin: "970426",
    shortName: "MSB",
    logo: "https://api.vietqr.io/img/MSB.png",

    swiftCode: "MCOBVNVX",
  },
  {
    id: 53,
    name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank",
    code: "CAKE",
    bin: "546034",
    shortName: "CAKE",
    logo: "https://api.vietqr.io/img/CAKE.png",
    swiftCode: null,
  },
  {
    id: 54,
    name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank",
    code: "Ubank",
    bin: "546035",
    shortName: "Ubank",
    logo: "https://api.vietqr.io/img/UBANK.png",

    swiftCode: null,
  },
  {
    id: 58,
    name: "Ngân hàng số Timo by Ban Viet Bank (Timo by Ban Viet Bank)",
    code: "TIMO",
    bin: "963388",
    shortName: "Timo",
    logo: "https://vietqr.net/portal-service/resources/icons/TIMO.png",

    swiftCode: null,
  },
  {
    id: 57,
    name: "Tổng Công ty Dịch vụ số Viettel - Chi nhánh tập đoàn công nghiệp viễn thông Quân Đội",
    code: "VTLMONEY",
    bin: "971005",
    shortName: "ViettelMoney",
    logo: "https://api.vietqr.io/img/VIETTELMONEY.png",

    swiftCode: null,
  },
  {
    id: 56,
    name: "VNPT Money",
    code: "VNPTMONEY",
    bin: "971011",
    shortName: "VNPTMoney",
    logo: "https://api.vietqr.io/img/VNPTMONEY.png",

    swiftCode: null,
  },
  {
    id: 34,
    name: "Ngân hàng TMCP Sài Gòn Công Thương",
    code: "SGICB",
    bin: "970400",
    shortName: "SaigonBank",
    logo: "https://api.vietqr.io/img/SGICB.png",

    swiftCode: "SBITVNVX",
  },
  {
    id: 3,
    name: "Ngân hàng TMCP Bắc Á",
    code: "BAB",
    bin: "970409",
    shortName: "BacABank",
    logo: "https://api.vietqr.io/img/BAB.png",

    swiftCode: "NASCVNVX",
  },
  {
    id: 30,
    name: "Ngân hàng TMCP Đại Chúng Việt Nam",
    code: "PVCB",
    bin: "970412",
    shortName: "PVcomBank",
    logo: "https://api.vietqr.io/img/PVCB.png",
    swiftCode: "WBVNVNVX",
  },
  {
    id: 27,
    name: "Ngân hàng Thương mại TNHH MTV Đại Dương",
    code: "Oceanbank",
    bin: "970414",
    shortName: "Oceanbank",
    logo: "https://api.vietqr.io/img/OCEANBANK.png",

    swiftCode: "OCBKUS3M",
  },
  {
    id: 24,
    name: "Ngân hàng TMCP Quốc Dân",
    code: "NCB",
    bin: "970419",
    shortName: "NCB",
    logo: "https://api.vietqr.io/img/NCB.png",

    swiftCode: "NVBAVNVX",
  },
  {
    id: 37,
    name: "Ngân hàng TNHH MTV Shinhan Việt Nam",
    code: "SHBVN",
    bin: "970424",
    shortName: "ShinhanBank",
    logo: "https://api.vietqr.io/img/SHBVN.png",

    swiftCode: "SHBKVNVX",
  },
  {
    id: 1,
    name: "Ngân hàng TMCP An Bình",
    code: "ABB",
    bin: "970425",
    shortName: "ABBANK",
    logo: "https://api.vietqr.io/img/ABB.png",

    swiftCode: "ABBKVNVX",
  },
  {
    id: 41,
    name: "Ngân hàng TMCP Việt Á",
    code: "VAB",
    bin: "970427",
    shortName: "VietABank",
    logo: "https://api.vietqr.io/img/VAB.png",

    swiftCode: "VNACVNVX",
  },
  {
    id: 23,
    name: "Ngân hàng TMCP Nam Á",
    code: "NAB",
    bin: "970428",
    shortName: "NamABank",
    logo: "https://api.vietqr.io/img/NAB.png",

    swiftCode: "NAMAVNVX",
  },
  {
    id: 29,
    name: "Ngân hàng TMCP Xăng dầu Petrolimex",
    code: "PGB",
    bin: "970430",
    shortName: "PGBank",
    logo: "https://api.vietqr.io/img/PGB.png",

    swiftCode: "PGBLVNVX",
  },
  {
    id: 46,
    name: "Ngân hàng TMCP Việt Nam Thương Tín",
    code: "VIETBANK",
    bin: "970433",
    shortName: "VietBank",
    logo: "https://api.vietqr.io/img/VIETBANK.png",

    swiftCode: "VNTTVNVX",
  },
  {
    id: 5,
    name: "Ngân hàng TMCP Bảo Việt",
    code: "BVB",
    bin: "970438",
    shortName: "BaoVietBank",
    logo: "https://api.vietqr.io/img/BVB.png",

    swiftCode: "BVBVVNVX",
  },
  {
    id: 33,
    name: "Ngân hàng TMCP Đông Nam Á",
    code: "SEAB",
    bin: "970440",
    shortName: "SeABank",
    logo: "https://api.vietqr.io/img/SEAB.png",

    swiftCode: "SEAVVNVX",
  },
  {
    id: 52,
    name: "Ngân hàng Hợp tác xã Việt Nam",
    code: "COOPBANK",
    bin: "970446",
    shortName: "COOPBANK",
    logo: "https://api.vietqr.io/img/COOPBANK.png",

    swiftCode: null,
  },
  {
    id: 20,
    name: "Ngân hàng TMCP Lộc Phát Việt Nam",
    code: "LPB",
    bin: "970449",
    shortName: "LPBank",
    logo: "https://api.vietqr.io/img/LPB.png",

    swiftCode: "LVBKVNVX",
  },
  {
    id: 19,
    name: "Ngân hàng TMCP Kiên Long",
    code: "KLB",
    bin: "970452",
    shortName: "KienLongBank",
    logo: "https://api.vietqr.io/img/KLB.png",

    swiftCode: "KLBKVNVX",
  },
  {
    id: 55,
    name: "Ngân hàng Đại chúng TNHH Kasikornbank",
    code: "KBank",
    bin: "668888",
    shortName: "KBank",
    logo: "https://api.vietqr.io/img/KBANK.png",

    swiftCode: "KASIVNVX",
  },
  {
    id: 50,
    name: "Ngân hàng Kookmin - Chi nhánh Hà Nội",
    code: "KBHN",
    bin: "970462",
    shortName: "KookminHN",
    logo: "https://api.vietqr.io/img/KBHN.png",

    swiftCode: null,
  },
  {
    id: 60,
    name: "Ngân hàng KEB Hana – Chi nhánh Thành phố Hồ Chí Minh",
    code: "KEBHANAHCM",
    bin: "970466",
    shortName: "KEBHanaHCM",
    logo: "https://api.vietqr.io/img/KEBHANAHCM.png",

    swiftCode: null,
  },
  {
    id: 61,
    name: "Ngân hàng KEB Hana – Chi nhánh Hà Nội",
    code: "KEBHANAHN",
    bin: "970467",
    shortName: "KEBHANAHN",
    logo: "https://api.vietqr.io/img/KEBHANAHN.png",

    swiftCode: null,
  },
  {
    id: 62,
    name: "Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam) ",
    code: "MAFC",
    bin: "977777",
    shortName: "MAFC",
    logo: "https://api.vietqr.io/img/MAFC.png",

    swiftCode: null,
  },
  {
    id: 59,
    name: "Ngân hàng Citibank, N.A. - Chi nhánh Hà Nội",
    code: "CITIBANK",
    bin: "533948",
    shortName: "Citibank",
    logo: "https://api.vietqr.io/img/CITIBANK.png",

    swiftCode: null,
  },
  {
    id: 51,
    name: "Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh",
    code: "KBHCM",
    bin: "970463",
    shortName: "KookminHCM",
    logo: "https://api.vietqr.io/img/KBHCM.png",

    swiftCode: null,
  },
  {
    id: 63,
    name: "Ngân hàng Chính sách Xã hội",
    code: "VBSP",
    bin: "999888",
    shortName: "VBSP",
    logo: "https://api.vietqr.io/img/VBSP.png",

    swiftCode: null,
  },
  {
    id: 49,
    name: "Ngân hàng TNHH MTV Woori Việt Nam",
    code: "WVN",
    bin: "970457",
    shortName: "Woori",
    logo: "https://api.vietqr.io/img/WVN.png",

    swiftCode: null,
  },
  {
    id: 48,
    name: "Ngân hàng Liên doanh Việt - Nga",
    code: "VRB",
    bin: "970421",
    shortName: "VRB",
    logo: "https://api.vietqr.io/img/VRB.png",

    swiftCode: null,
  },
  {
    id: 40,
    name: "Ngân hàng United Overseas - Chi nhánh TP. Hồ Chí Minh",
    code: "UOB",
    bin: "970458",
    shortName: "UnitedOverseas",
    logo: "https://api.vietqr.io/img/UOB.png",

    swiftCode: null,
  },
  {
    id: 32,
    name: "Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam",
    code: "SCVN",
    bin: "970410",
    shortName: "StandardChartered",
    logo: "https://api.vietqr.io/img/SCVN.png",

    swiftCode: "SCBLVNVX",
  },
  {
    id: 28,
    name: "Ngân hàng TNHH MTV Public Việt Nam",
    code: "PBVN",
    bin: "970439",
    shortName: "PublicBank",
    logo: "https://api.vietqr.io/img/PBVN.png",

    swiftCode: "VIDPVNVX",
  },
  {
    id: 25,
    name: "Ngân hàng Nonghyup - Chi nhánh Hà Nội",
    code: "NHB HN",
    bin: "801011",
    shortName: "Nonghyup",
    logo: "https://api.vietqr.io/img/NHB.png",

    swiftCode: null,
  },
  {
    id: 18,
    name: "Ngân hàng TNHH Indovina",
    code: "IVB",
    bin: "970434",
    shortName: "IndovinaBank",
    logo: "https://api.vietqr.io/img/IVB.png",

    swiftCode: null,
  },
  {
    id: 16,
    name: "Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh TP. Hồ Chí Minh",
    code: "IBK - HCM",
    bin: "970456",
    shortName: "IBKHCM",
    logo: "https://api.vietqr.io/img/IBK.png",

    swiftCode: null,
  },
  {
    id: 15,
    name: "Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội",
    code: "IBK - HN",
    bin: "970455",
    shortName: "IBKHN",
    logo: "https://api.vietqr.io/img/IBK.png",

    swiftCode: null,
  },
  {
    id: 14,
    name: "Ngân hàng TNHH MTV HSBC (Việt Nam)",
    code: "HSBC",
    bin: "458761",
    shortName: "HSBC",
    logo: "https://api.vietqr.io/img/HSBC.png",

    swiftCode: "HSBCVNVX",
  },
  {
    id: 13,
    name: "Ngân hàng TNHH MTV Hong Leong Việt Nam",
    code: "HLBVN",
    bin: "970442",
    shortName: "HongLeong",
    logo: "https://api.vietqr.io/img/HLBVN.png",

    swiftCode: "HLBBVNVX",
  },
  {
    id: 11,
    name: "Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu",
    code: "GPB",
    bin: "970408",
    shortName: "GPBank",
    logo: "https://api.vietqr.io/img/GPB.png",

    swiftCode: "GBNKVNVX",
  },
  {
    id: 9,
    name: "Ngân hàng TMCP Đông Á",
    code: "DOB",
    bin: "970406",
    shortName: "DongABank",
    logo: "https://api.vietqr.io/img/DOB.png",

    swiftCode: "EACBVNVX",
  },
  {
    id: 8,
    name: "DBS Bank Ltd - Chi nhánh Thành phố Hồ Chí Minh",
    code: "DBS",
    bin: "796500",
    shortName: "DBSBank",
    logo: "https://api.vietqr.io/img/DBS.png",

    swiftCode: "DBSSVNVX",
  },
  {
    id: 7,
    name: "Ngân hàng TNHH MTV CIMB Việt Nam",
    code: "CIMB",
    bin: "422589",
    shortName: "CIMB",
    logo: "https://api.vietqr.io/img/CIMB.png",

    swiftCode: "CIBBVNVN",
  },
  {
    id: 6,
    name: "Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam",
    code: "CBB",
    bin: "970444",
    shortName: "CBBank",
    logo: "https://api.vietqr.io/img/CBB.png",

    swiftCode: "GTBAVNVX",
  },
];
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type AddBankAccountProps = NativeStackScreenProps<any, any>;

const AddBankAccount = ({ navigation, route }: AddBankAccountProps) => {
  // const { onAddAccount } = route.params;

  const [showBankSelect, setShowBankSelect] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<BankType | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  const bankSelectModalRef = useRef<Modalize>(null);

  const filteredBanks = BANK_LIST.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleOpenBankSelect = () => {
    setSearchText("");
    bankSelectModalRef.current?.open();
    // setShowBankSelect(true);
  };

  const handleSelectBank = (
    bank: BankType,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    console.log("check bank", bank);
    setSelectedBank(bank);
    setFieldValue("bankName", bank.shortName);
    setFieldValue("bankShortName", bank.shortName);
    bankSelectModalRef.current?.close();
  };

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.string().required("Số tài khoản là bắt buộc"),
    bankName: Yup.string().required("Vui lòng chọn ngân hàng"),
    accountHolderName: Yup.string().required("Tên chủ tài khoản là bắt buộc"),
  });
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});

  const handleSubmit = (values: any) => {
    console.log("check values", values);
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
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
            <Image
              source={{ uri: item.logo }}
              className="h-full w-full rounded-full"
              resizeMode="contain"
            />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-medium text-gray-800">{item.name}</Text>
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
              bankName: "",
              bankShortName: "",
              accountHolderName: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, setFieldValue, values, errors, touched }) => {
              handleSubmitRef.current = handleSubmit;

              return (
                <View>
                  <InputComponent
                    name="accountNumber"
                    label="Số tài khoản"
                    placeholder="Nhập số tài khoản"
                    labelClass="text-text-gray text-sm"
                    inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                  />

                  <View className="mb-5">
                    <Text className="mb-1 text-sm text-text-gray">
                      Ngân hàng
                    </Text>
                    <TouchableOpacity
                      className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
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
                      <Text className="mt-1 text-[12px] text-red">
                        {errors.bankName}
                      </Text>
                    )}
                  </View>

                  <InputComponent
                    name="bankName"
                    label="Tên ngân hàng"
                    placeholder="Nhập tên ngân hàng"
                    labelClass="text-text-gray text-sm"
                    inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <InputComponent
                    name="accountHolderName"
                    label="Tên chủ tài khoản"
                    placeholder="Nhập tên chủ tài khoản"
                    labelClass="text-text-gray text-sm"
                    inputClass="h-11 text-text-gray bg-gray-50 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </View>
              );
            }}
          </Formik>
        </SectionComponent>

        <ModalLizeComponent
          modalStyle={{ minHeight: 796 }}
          ref={bankSelectModalRef}
          HeaderComponent={
            <View className="rounded-t-[30px] bg-white px-6 py-4">
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
        </ModalLizeComponent>
        <SectionComponent rootClassName=" px-5 rounded-lg absolute bottom-5 w-full flex-1">
          <Pressable
            onPress={() => handleSubmitRef.current()}
            className="h-12 items-center justify-center rounded-lg bg-primary"
          >
            <Text className="text-base font-semibold text-white">Xác nhận</Text>
          </Pressable>
        </SectionComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default AddBankAccount;
