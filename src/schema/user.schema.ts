import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ActionType, WeightUnit } from 'src/core/interface';
// s-todo: 这里如何把打包路径 改成~ 或者 @ 呢？
import { IAction } from '../core/interface';

// NOTE: how to create nested json? https://github.com/nestjs/mongoose/issues/839
@Schema({ _id: false })
export class Action {
  @Prop()
  name: string;
  @Prop()
  weight_unit: WeightUnit;
  @Prop()
  set_list: Array<{
    rpe: number;
    order: number;
    weight: number;
    repeat: number;
    type: ActionType;
  }>;
}

export const ActionSchema = SchemaFactory.createForClass(Action);

@Schema({ _id: false })
export class TrainingTemplate {
  @Prop()
  _id: number;
  @Prop()
  name: string;
  @Prop()
  memo: string;
  @Prop()
  create_time: number;
  @Prop()
  update_time: number;
  @Prop({ type: [ActionSchema] })
  schedule: Array<Action>;
}
const TrainingTemplateSchema = SchemaFactory.createForClass(TrainingTemplate);

/**
 * s-mark: 如果想做笔记，那应该是一个比较大的模块，而不是插在每个动作里。
 */
@Schema({ _id: false })
export class User {
  @Prop()
  _id: string;
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
  cur_active_plan_id: string;
  // 训练卡片模板集合
  @Prop({ type: [TrainingTemplateSchema], default: [] })
  training_templates: Array<TrainingTemplate>;
  // 个人定制化的动作集
  @Prop({ type: [ActionSchema], default: [], _id: false })
  private_actions: Array<IAction>;
  async validatePassword(password: string): Promise<boolean> {
    return (await bcrypt.hash(password, this.salt)) === this.pass_word;
  }
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
