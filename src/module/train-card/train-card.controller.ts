import { TrainCardService } from './train-card.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTrainDto } from 'src/core/dto';
import { HTTPResponse } from 'src/util/HTTPResponse';
import { PlanCode, PlanCode2Message } from 'src/domain/business-code';

@Controller('train-card')
export class TrainCardController {
  constructor(private readonly trainCardService: TrainCardService) { }
  @Post()
  async create(@Body() dto: CreateTrainDto) {
    try {
      const data = await this.trainCardService.crete(dto);
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
  @Get()
  async getAll() {
    try {
      const allCards = await this.trainCardService.getAll();
      return new HTTPResponse(
        PlanCode.successGetAll,
        PlanCode2Message[PlanCode.successGetAll],
        allCards,
      );
    } catch (e) { }
  }
}
