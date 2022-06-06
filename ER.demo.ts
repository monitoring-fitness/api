export enum WeightUnit {
    Lb,
    Kg,
}

/**
 * 和训练总量关联，
 */
export enum TrainType {
    Shoulder,
    Chest,
    Back,
    Leg,
    Hip,
    Arm
}

/**
 * 训练卡片中的动作说明
 */
type TrainItem = {
    name: string // 训练项目名称
    type: TrainType
    weight?: number // 重量
    weight_unit?: WeightUnit // 重量单位
    group_num?: number // 组数
    repeat_num?: number // 重复次数
}

interface Plan {
    id: number
    create_time: number
    start_time: number
    end_time: number // 计算出来的时间?
    complete_time: number // 最后完成的时间,如果提早结束训练，那么完成时间和计划的end_time 不一致
    duration: number
    name: string
    explain: string // 计划说明
    TODO_kr: any
    schedules: Array<{
        date: string
        is_history: boolean // 冗余字段，标识是否是历史数据了，如果是则为immutable,否则可以修改train_program
        is_training_day: boolean // 是否是训练日
        is_giving_up_training: boolean // 是否放弃今天的训练
        snap_card_id: string // 使用的卡片id快照,为了能够实现替换未来相关卡片
        train_program: Array<TrainItem>
        TODO_eating_program: string
    }>
}

type BodyRecord = & BasicRecordSchema

type BasicRecordSchema = {
    date: string // 生成记录的日期
    val: number // 具体值 : 体重？维度？训练总量？
    plan_id: number // 为了能够从record中引出这天训练的细节
}

interface UserRecord {
    user_id: string
    weight_infos: Array<{ // 体重记录
        weight_unit: WeightUnit
    } & BasicRecordSchema>
    body_infos: Array<{ // 身体维度指标
        place_type: TrainType // 哪个身体部位
    } & BodyRecord>
    hight_infos: Array<BasicRecordSchema>
    // diet_infos 从业务角度来看，饮食记录是和Plan绑定死的,高维度的UserRecord不需要
}

interface User {
    id: string
    name: string
    email: string
    pass_word: string
    avatar_url: string
    cur_active_plan_id: number
    train_cards: Array<{
        card_id: number
        memo: string
        train_program: Array<TrainItem>
    }>
}
