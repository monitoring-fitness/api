import { Document } from 'mongoose';
import {
  ActionType,
  WeightUnit,
} from '../../common/interface/train-basic.interface';

export class IActionSet {
  rpe: number;
  order: number;
  weight: number;
  repeat: number;
  type: ActionType;
}

export class IAction extends Document {
  name: string;
  weight_unit: WeightUnit;
  set_list: IActionSet[];
}

export interface ITrainBoilerplate extends Document {
  name: string;
  intro: string;
  is_public: boolean;
  create_author_id: string;
  create_time: number;
  update_time: number;
  schedule: IAction[];
}
