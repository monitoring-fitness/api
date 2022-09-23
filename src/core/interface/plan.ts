import { ActionDetailType, TrainProgram } from '.';

type ActionList = Array<
  TrainProgram & {
    detail_list: Array<{
      order: number;
      weight: number;
      repeat: number;
      type: ActionDetailType;
    }>;
  }
>;

/**
 * 计划中的每一天
 *
 * 反复 R-W 的 结构体
 *
 * s-mark: 休息日判断，严格意义上，业务逻辑决定的，可能是：
 * 1. 不去健身房
 * 2. 去健身房，但是训练量很低
 */
export interface ISchedule {
  _id?: string;
  is_giving_up: boolean; // 是否放弃今天的训练
  complete_date: number; // 完成日期
  perform_date: number; // 执行日期
  snap_card_id: string; // 使用的卡片id快照,为了能够实现替换未来相关卡片
  snap_card_name: string;
  /**
   * 具体要做的动作，以及每组具体做的内容
   */
  action_list: ActionList;
}

export interface IPlan {
  _id?: string;
  user_id?: string;
  create_time?: number;
  start_time?: number;
  end_time?: number;
  duration?: number; // 和end_time 是两种时间维度的表达方式，以end_time为准，则认为到某一具体天，一定会结束；以duration为准，则认为需要累计 x 天/周 才结束。
  name?: string;
  explain?: string; // 计划说明
  schedules?: Array<ISchedule>;
}
