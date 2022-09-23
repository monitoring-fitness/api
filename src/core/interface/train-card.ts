import { BodyScope, WeightUnit } from '.';

export interface ITrainCard {
  _id?: string;
  name: string;
  memo: string;
  create_time?: number; // 创建时间
  update_time?: number; // 更新时间
  train_program: Array<TrainProgram>;
}

/**
 * 共用的动作基础单元
 *
 *  - 训练卡片中的动作说明
 *  - 计划中的动作说明
 */
export interface TrainProgram {
  name: string;
  body_scope: BodyScope;
  group_count: number; // 组数
  weight_unit: WeightUnit; // 重量单位
  default_weight: number; // 初始重量,用来批量生成每组的重量
  default_repeat: number; // 初始重复次数,用来批量生成每组的重复次数
}
