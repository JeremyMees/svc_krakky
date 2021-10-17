export interface ResetPasswordTokenModel {
  user_id: string;
  resetPasswordToken: string;
  expire: string;
}
