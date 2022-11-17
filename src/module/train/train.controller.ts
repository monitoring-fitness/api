import { TrainService } from './train.service';
import { Body, Controller, Post } from '@nestjs/common';
import { HTTPResponse } from 'src/util/HTTPResponse';
import { PlanCode, PlanCode2Message } from 'src/domain/business-code';
import { CreateTrainingTemplateDto } from '../../core/dto/';

@Controller('training')
export class TrainController {
  constructor(private readonly trainCardService: TrainService) {}

  /**
   * 创建个人私有动作
   * @param dto
   */
  // @Post()
  // async createPrivateAction(@Body() dto: CreatePrivateActionDto) {
  //   return await this.trainCardService.crete(dto);
  // }

  /**
   * 创建训练卡片模板
   * @param training
   */
  @Post('template/create')
  async createTrainingTemplate(@Body() training: CreateTrainingTemplateDto) {
    try {
      const data = await this.trainCardService.createTrainCardTemplate(
        training,
      );
      return new HTTPResponse(
        PlanCode.successCreated,
        PlanCode2Message[PlanCode.successCreated],
        data,
      );
    } catch (error) {
      const code = error as PlanCode;
      return new HTTPResponse(code, PlanCode2Message[code], null);
    }
  }
  // @Get()
  // async getAll() {
  //   try {
  //     const allCards = await this.trainCardService.getAll();
  //     return new HTTPResponse(
  //       PlanCode.successGetAll,
  //       PlanCode2Message[PlanCode.successGetAll],
  //       allCards,
  //     );
  //   } catch (e) { }
  // }
}
