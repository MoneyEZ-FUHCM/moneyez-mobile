const BANK_ACCOUNT_CONSTANT = {
  BANK_LIST: [
    {
      id: 1,
      name: "MoneyEz Bank Sandbox",
      code: "EZB",
      bin: "123456",
      shortName: "EZB",
      logo: "https://firebasestorage.googleapis.com/v0/b/exe201-9459a.appspot.com/o/EzMoney%2Flogo-org.png?alt=media&token=7622aeca-19b2-4632-b5b4-81c9a33bb19f",
      transferSupported: 1,
      lookupSupported: 1,
    },
    {
      id: 43,
      name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
      code: "VCB",
      bin: "970436",
      shortName: "Vietcombank",
      logo: "https://api.vietqr.io/img/VCB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "Vietcombank",
      support: 3,
      isTransfer: 1,
      swift_code: "BFTVVNVX",
    },
    {
      id: 42,
      name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
      code: "VBA",
      bin: "970405",
      shortName: "Agribank",
      logo: "https://api.vietqr.io/img/VBA.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "Agribank",
      support: 3,
      isTransfer: 1,
      swift_code: "VBAAVNVX",
    },
    {
      id: 38,
      name: "Ngân hàng TMCP Kỹ thương Việt Nam",
      code: "TCB",
      bin: "970407",
      shortName: "Techcombank",
      logo: "https://api.vietqr.io/img/TCB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "Techcombank",
      support: 3,
      isTransfer: 1,
      swift_code: "VTCBVNVX",
    },
    {
      id: 4,
      name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      code: "BIDV",
      bin: "970418",
      shortName: "BIDV",
      logo: "https://api.vietqr.io/img/BIDV.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "BIDV",
      support: 3,
      isTransfer: 1,
      swift_code: "BIDVVNVX",
    },
    {
      id: 21,
      name: "Ngân hàng TMCP Quân đội",
      code: "MB",
      bin: "970422",
      shortName: "MBBank",
      logo: "https://api.vietqr.io/img/MB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "MBBank",
      support: 3,
      isTransfer: 1,
      swift_code: "MSCBVNVX",
    },
    {
      id: 47,
      name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
      code: "VPB",
      bin: "970432",
      shortName: "VPBank",
      logo: "https://api.vietqr.io/img/VPB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "VPBank",
      support: 3,
      isTransfer: 1,
      swift_code: "VPBKVNVX",
    },
    {
      id: 2,
      name: "Ngân hàng TMCP Á Châu",
      code: "ACB",
      bin: "970416",
      shortName: "ACB",
      logo: "https://api.vietqr.io/img/ACB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "ACB",
      support: 3,
      isTransfer: 1,
      swift_code: "ASCBVNVX",
    },
    {
      id: 17,
      name: "Ngân hàng TMCP Công thương Việt Nam",
      code: "ICB",
      bin: "970415",
      shortName: "VietinBank",
      logo: "https://api.vietqr.io/img/ICB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "VietinBank",
      support: 3,
      isTransfer: 1,
      swift_code: "ICBVVNVX",
    },
    {
      id: 39,
      name: "Ngân hàng TMCP Tiên Phong",
      code: "TPB",
      bin: "970423",
      shortName: "TPBank",
      logo: "https://api.vietqr.io/img/TPB.png",
      transferSupported: 1,
      lookupSupported: 1,
      short_name: "TPBank",
      support: 3,
      isTransfer: 1,
      swift_code: "TPBVVNVX",
    },
  ],

  ERROR_CODE: {
    BANK_ACCOUNT_NOT_FOUND: "BankAccountNotFound",
    WEB_HOOK_REGISTRATION_FAILED: "WebhookRegistrationFailed",
  },
};

export default BANK_ACCOUNT_CONSTANT;
