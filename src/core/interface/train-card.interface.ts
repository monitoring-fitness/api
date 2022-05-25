export interface ITrainCard {
  name: string;
  memo: string;
  train_program: Array<ITrainItem>;
}
/**
 * 训练卡片中的动作说明
 */
export interface ITrainItem {
  name: string; // 训练项目名称
  type: number; // 项目枚举 TODO: 这里是和mock的动作列表中的type一致哈？
  execute_info: ITrainItemExecuteInfo;
}

export interface ITrainItemExecuteInfo {
  weight?: number; // 重量
  weight_unit?: WeightUnit; // 重量单位
  group_num?: number; // 组数
  repeat_num?: number; // 重复次数
}

export enum TrainType {
  Muscle,
}

export enum WeightUnit {
  Lb,
  Kg,
}
