import { ObjectId } from 'mongoose';
import { ITrainItem } from '.';

// S-TODO: 需要增加 _ id
export interface ISchedules {
  date: number;
  is_giving_up_training: boolean; // 是否放弃今天的训练
  snap_card_id: string; // 使用的卡片id快照,为了能够实现替换未来相关卡片
  snap_card_name: string;
  train_program: Array<ITrainItem>;
}

export interface IPlan {
  _id?: ObjectId;
  user_id?: string;
  create_time?: number;
  start_time?: number;
  end_time?: number; // 计算出来的时间?
  complete_time?: number; // 最后完成的时间,如果提早结束训练，那么完成时间和计划的end_time 不一致
  duration?: number; // 这里强制以周为单位进行
  name?: string;
  explain?: string; // 计划说明
  schedules?: Array<ISchedules>;
}
