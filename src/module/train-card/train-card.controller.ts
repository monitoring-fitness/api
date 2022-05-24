import { TrainCardService } from './train-card.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('train-card')
export class TrainCardController {
    constructor(private readonly trainCardService: TrainCardService) { }
    @Post()
    async create(@Body() dto: any) {
        await this.trainCardService.crete(dto)
    }
    @Get()
    async getAll() {
        return await this.trainCardService.getAll()
    }
}


