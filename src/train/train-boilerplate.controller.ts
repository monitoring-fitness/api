import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlanCode, PlanCode2Message } from 'src/common/business-code';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { User } from 'src/common/decorator/user.decorator';
import { Iuser } from 'src/auth/interface/user.interface';
import { CreateTrainBoilerplateDto } from './dto/create-train-boilerplate.dto';
import { TrainBoilerplateService } from './train-boilerplate.service';

@UseGuards(AuthGuard())
@Controller('train_boilerplate')
export class TrainBoilerplateController {
  constructor(
    private readonly trainBoilerplateService: TrainBoilerplateService,
  ) {}

  @Post('create')
  async create(
    @Body() boilerplate: CreateTrainBoilerplateDto,
    @User() user: Iuser,
  ) {
    await this.trainBoilerplateService.create(boilerplate);
    return new ResponseSuccess(PlanCode2Message[PlanCode.successCreated]);
  }
  @Get('get/all')
  async getAll() {
    await this.trainBoilerplateService.getAll();
    return new ResponseSuccess(PlanCode2Message[PlanCode.successGetAll]);
  }
}
