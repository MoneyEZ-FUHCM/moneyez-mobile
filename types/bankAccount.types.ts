export interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  bankShortName: string;
  createdBy: string;
  createdDate: string;
  isDeleted: boolean;
  status?: string | null;
}

export interface BankAccountType {
  createdDate: string;
  bankLogo: string | undefined;
  id: string | number;
  accountNumber: string;
  bankName: string;
  bankShortName: string;
  accountHolderName: string;
}

export interface BankType {
  id: number;
  code: string;
  name: string;
  swiftCode: string | null;
  bin: string;
  shortName: string;
  logo: string;
}

export interface BankCardProps {
  item: BankAccountType;
  onPress: () => void;
}

export interface CreateBankAccountPayload {
  accountNumber: string;
  bankName: string;
  bankShortName: string;
  accountHolderName: string;
}
