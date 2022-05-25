import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IUserAuth,
  ITrainCard,
  ITrainItem,
  ITrainItemExecuteInfo,
  WeightUnit,
} from 'src/core/interface';
import * as bcrypt from 'bcrypt';

// NOTE: how to create nested json? https://github.com/nestjs/mongoose/issues/839

@Schema({ _id: false })
export class TrainItemExecuteInfo implements ITrainItemExecuteInfo {
  @Prop()
  weight: number;
  @Prop()
  weight_unit: WeightUnit;
  @Prop()
  group_num: number;
  @Prop()
  repeat_num: number;
}

const TrainItemExecuteInfoSchema =
  SchemaFactory.createForClass(TrainItemExecuteInfo);

@Schema({ _id: false })
export class TrainItem implements ITrainItem {
  @Prop()
  name: string;
  @Prop()
  type: number;
  @Prop({ type: TrainItemExecuteInfoSchema })
  execute_info: TrainItemExecuteInfo;
}

const TrainItemSchema = SchemaFactory.createForClass(TrainItem);

@Schema()
export class DefaultCard implements ITrainCard {
  @Prop()
  name: string;
  @Prop()
  memo: string;
  @Prop({ type: [TrainItemSchema] })
  train_program: Array<TrainItem>;
}

const DefaultCardSchema = SchemaFactory.createForClass(DefaultCard);

@Schema()
export class User implements IUserAuth {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  pass_word: string;
  @Prop()
  salt: string;
  @Prop()
  avatar_url: string;
  @Prop()
  cur_active_plan_id: number;
  @Prop({ type: [DefaultCardSchema], default: [] })
  default_cards: DefaultCard[];

  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.pass_word;
  }
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
