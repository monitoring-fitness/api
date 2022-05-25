export enum TrainCardCode {
  successCreated = 40000,
  successGetAll,
  isExist,
  isTest,
}

export const TrainCardCode2Message: Record<TrainCardCode, string> = {
  [TrainCardCode.successCreated]: '卡片创建成功！',
  [TrainCardCode.successGetAll]: '所有卡片获取成功！',
  [TrainCardCode.isExist]: '卡片存在，不允许重新创建',
  [TrainCardCode.isTest]: '测试',
};
