interface CreateGroupPayload {
  name: string;
  description: string;
  currentBalance: number;
  accountBankId: string;
  image: string;
}

interface Group {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  currentBalance: number;
  status: string;
  visibility: string;
  imageUrl: string;
  groupMembers: any[];
}