export interface DecodedToken {
  email?: string;
  role?: string;
  emailConfirmed?: string;
  iat: number;
  exp: number;
}

export interface EmailDecodedToken {
  email?: string;
  iat: number;
  exp: number;
}

export interface EmailData {
  email: string;
  subject: string;
  template: string;
}

export interface SmsData {
  body: string;
  to: string;
  from: string;
}
