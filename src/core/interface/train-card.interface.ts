// S-TODO: 应该迁移到UserSchema的interface中下更合适吧？

export interface ITrainCard {
  _id?: string;
  name: string;
  memo: string;
  train_program: Array<ITrainItem>;
  create_time?: number; // 创建时间
  update_time?: number; // 更新时间
}
/**
 * 训练卡片中的动作说明
 */
export interface ITrainItem {
  name: string; // 训练项目名称
  type: number; // 项目枚举 TODO: 这里是和mock的动作列表中的type一致哈？
  weight: number; // 重量
  weight_unit: WeightUnit; // 重量单位
  group_num: number; // 组数
  repeat_num: number; // 重复次数
}

export enum TrainType {
  Muscle,
}

export enum WeightUnit {
  Lb,
  Kg,
}
