export interface PhoneHistoryDTO {
  date: string;
  externalNumber: string;
  callSymbolColor: string;
}

export interface PhoneHistory {
  date: string;
  phoneNumber: string;
  mode: "ingoing" | "outgoing";
}
