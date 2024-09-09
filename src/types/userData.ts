export interface totpItems {
  name: string;
  secret: string;
  category: string;
}

export interface UserData {
  uid: string;
  totp: totpItems[];
} 