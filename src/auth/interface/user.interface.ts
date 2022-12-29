import { Document } from 'mongoose';

export interface Iuser extends Document {
  name: string;
  pass_word: string;
  salt: string;
  avatar_url: string;
  auth: {
    email: string;
  };
  settings: Record<string, unknown>;
  train_info: {
    // 个人训练模板合集
    personal_train_boilerplate: string[];
    // 个人创建的私有训练动作合集
    personal_train_actions: string[];
  };
  plan_info: {
    // 当前正在进行的计划
    cur_active_plan_id: string;
    // 历史执行过的训练计划合集
    personal_plans: string[];
  };
}
