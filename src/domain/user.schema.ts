import { Schema, SchemaFactory, Prop, raw, } from '@nestjs/mongoose';
import { Document } from "mongoose";

// NOTE: how to create nested json? https://github.com/nestjs/mongoose/issues/839

enum WeightUnit {
    Lb,
    Kg,
}

@Schema({ _id: false })
export class TrainItemExecuteInfo {
    @Prop()
    weight: number // 重量
    @Prop()
    weight_unit: WeightUnit // 重量单位
    @Prop()
    group_num: number // 组数
    @Prop()
    repeat_num: number // 重复次数
}

const TrainItemExecuteInfoSchema = SchemaFactory.createForClass(TrainItemExecuteInfo)

@Schema({ _id: false })
export class TrainItem {
    @Prop()
    name: string // 训练项目名称
    @Prop()
    type: number // 项目枚举 TODO: 这里是和mock的动作列表中的type一致哈？ 
    @Prop({ type: TrainItemExecuteInfoSchema })
    execute_info: TrainItemExecuteInfo
}

const TrainItemSchema = SchemaFactory.createForClass(TrainItem)

@Schema({ _id: false })
export class DefaultCard {
    @Prop()
    card_id: number
    @Prop()
    memo: string
    @Prop({ type: [TrainItemSchema] })
    train_program: Array<TrainItem>
}

const DefaultCardSchema = SchemaFactory.createForClass(DefaultCard)

@Schema()
export class User extends Document {
    @Prop()
    name: string
    @Prop()
    email: string
    @Prop()
    pass_word: string
    @Prop()
    avatar_url: string
    @Prop()
    cur_active_plan_id: number
    @Prop({ type: [DefaultCardSchema] })
    default_cards: DefaultCard[]
}
export const UserSchema = SchemaFactory.createForClass(User)