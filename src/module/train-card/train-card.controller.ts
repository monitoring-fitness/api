import { TrainCardService } from './train-card.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTrainDto } from 'src/core/dto/create-train.dto';
import { HTTPResponse } from 'src/util/HTTPResponse';
import { TrainCardCode, TrainCardCode2Message } from 'src/domain/error-code';

@Controller('train-card')
export class TrainCardController {
  constructor(private readonly trainCardService: TrainCardService) {}
  @Post()
  async create(@Body() dto: CreateTrainDto) {
    try {
      const data = await this.trainCardService.crete(dto);
      return new HTTPResponse(
        TrainCardCode.successCreated,
        TrainCardCode2Message[TrainCardCode.successCreated],
        data,
      );
    } catch (error) {
      const code = error as TrainCardCode;
      return new HTTPResponse(code, TrainCardCode2Message[code], null);
    }
  }
  @Get()
  async getAll() {
    try {
      const allCards = await this.trainCardService.getAll();
      return new HTTPResponse(
        TrainCardCode.successGetAll,
        TrainCardCode2Message[TrainCardCode.successGetAll],
        allCards,
      );
    } catch (e) {}
  }
}
