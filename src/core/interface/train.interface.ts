import { ActionType, BodyScope, WeightUnit } from './index';

/**
 * 每组动作的详细描述
 */
interface TrainSetInfo {
  type: ActionType; // 当前组类型
  order: number; // 第几组
  weight: number; // 使用的重量
  repeat: number; // 重复次数
  rpe: number;
}

/**
 * 每个动作最基本的字段
 */
export interface ActionBasicInfo {
  _id: string;
  name: string;
  introduction: string;
  body_scope: BodyScope;
}

/**
 * 每个动作详细的字段
 */
export interface IAction extends ActionBasicInfo {
  group_count: number; // 组数
  weight_unit: WeightUnit; // 重量单位
  default_weight: number; // 用来批量生成每组的重量
  default_repeat_time: number; // 用来批量生成每组的重复次数
  default_rpe: number; // 用来批量生成每组的rpe
  set_list: Array<TrainSetInfo>;
}

/**
 * 训练模板
 */
export interface ITrainingTemplate {
  _id: string;
  name: string;
  create_time: number; // 创建时间
  update_time: number; // 更新时间
  schedule: Array<IAction>; // 训练计划表
}
