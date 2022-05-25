export enum UserAuthCode {
  successCreated = 10000,
}

export const UserAuthCode2Message: Record<UserAuthCode, string> = {
  [UserAuthCode.successCreated]: '用户创建成功',
};
