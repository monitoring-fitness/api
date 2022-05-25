import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IUserAuth } from 'src/core/interface';

export class AuthCredentialDto implements IUserAuth {
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

export class AuthLoginDto implements Pick<IUserAuth, 'name' | 'pass_word'> {
  name: string;
  pass_word: string;
}
