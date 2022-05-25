export interface IUserAuth {
  name: string;
  email: string;
  pass_word: string;
  salt?: string;
  avatar_url: string;
}
