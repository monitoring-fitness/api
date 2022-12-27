export enum PlanCode {
  successCreated = 40000,
  successGetAll,
  isExist,
  isTest,
}

export const PlanCode2Message: Record<PlanCode, string> = {
  [PlanCode.successCreated]: '计划创建成功！',
  [PlanCode.successGetAll]: '所有卡片获取成功！',
  [PlanCode.isExist]: '同名计划已存在，不允许重新创建',
  [PlanCode.isTest]: '测试',
};
