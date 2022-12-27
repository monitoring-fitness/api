import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BodyScope, ActionBasicInfo } from '../core/interface';

@Schema()
export class SPublicTrainItem implements Omit<ActionBasicInfo, '_id'> {
  @Prop()
  name: string;
  @Prop()
  body_scope: BodyScope;
  @Prop()
  introduction: string;
}

export const sfPublicTrainItem = SchemaFactory.createForClass(SPublicTrainItem);
