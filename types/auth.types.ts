export interface AuthRequest {
  email: string;
  password: string;
}
export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
}

export interface GoogleUserInfo {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photo: string;
}

export interface GoogleSignInResponse {
  idToken: string | undefined;
  user: GoogleUserInfo;
  scopes: string[];
  serverAuthCode: string | undefined;
}
