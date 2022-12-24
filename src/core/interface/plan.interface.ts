import { IAction } from './train.interface';
import { DailyWorkOutStatus } from './common';

export interface IDailyLife {
  status: DailyWorkOutStatus;
  snap_template_id: string; // 使用的卡片id快照,为了能够实现替换未来相关卡片
  /**
   * 具体要做的动作，以及每组具体做的内容
   */
  to_perform_date: number; // 执行日期
  completed_date: number; // 完成日期
  action_list: Array<
    Omit<
      IAction,
      'group_count' | 'default_repeat_time' | 'default_rpe' | 'default_weight'
    >
  >;
}

export interface IPlan {
  user_id: string;
  name: string;
  memo: string; // 计划说明
  daily_life?: Array<IDailyLife>;
  create_time: number;
  start_time: number;
  end_time: number;
}
