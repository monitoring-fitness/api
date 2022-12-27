import { PickType } from '@nestjs/mapped-types';
import { UserSignupDto } from './user-signup.dto';

export class UserSigninDto extends PickType(UserSignupDto, [
  'name',
  'pass_word',
]) {}
