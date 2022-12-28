import { TrainCardCode } from './train-card';
import { UserAuthCode } from './user-auth';
export * from './train-card';
export * from './plan';
export * from './user-auth';
export type ErrorCode = TrainCardCode | UserAuthCode;
