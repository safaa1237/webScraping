import { Controller, Get, Param } from '@nestjs/common';
import { TitleService } from './title.service';

@Controller('get-title')
export class TitleController {
  constructor(private readonly titleService : TitleService){}

    @Get('/:asin')
    gettitle(@Param('asin') asin):any {
        return this.titleService.getTitleFromQueue(asin);
    };
    
}

