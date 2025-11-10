export type RegisterRole = "viewer" | "editor";

export type AuthMode = "login" | "register" | "admin-create";

export type AuthForm = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  organization: string;
  country: string;
  phoneNumber: string;
  jobTitle: string;
};
