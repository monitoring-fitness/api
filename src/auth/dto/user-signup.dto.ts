import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserSignupDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  pass_word: string;
  email: string;
  avatar_url: string;
}
