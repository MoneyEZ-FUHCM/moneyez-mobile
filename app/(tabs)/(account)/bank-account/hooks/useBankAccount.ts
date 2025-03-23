import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { useState } from "react";
import { useDispatch } from "react-redux";
interface BankAccountType {
  id: number;
  accountNumber: string;
  bankName: string;
  bankShortName: string;
  accountHolderName: string;
}
const useBankAccount = () => {
  const dispatch = useDispatch();
  useHideTabbar();
  const handleBack = () => {
    dispatch(setMainTabHidden(false));
    router.back();
  };

  const [bankAccounts, setBankAccounts] = useState<BankAccountType[]>([
    {
      id: 1,
      accountNumber: "123456789",
      bankName: "Ngân hàng A",
      bankShortName: "NHA",
      accountHolderName: "Nguyễn Văn A",
    },
    {
      id: 2,
      accountNumber: "987654321",
      bankName: "Ngân hàng B",
      bankShortName: "NHB",
      accountHolderName: "Trần Thị B",
    },
  ]);

  const handleDeleteAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter((account) => account.id !== id));
  };
  return {
    state: {},
    handler: {
      handleBack,
      handleDeleteAccount,
    },
  };
};

export default useBankAccount;
