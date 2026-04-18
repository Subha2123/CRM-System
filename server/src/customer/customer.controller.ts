import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from 'src/auth/auth-gaurd';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CurrentUser } from 'src/common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Post()
  create(
    @Body() body: CreateCustomerDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.service.create(body, userId);
  }

  @Get()
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.service.findAll({ search, status });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('userId') userId: string,
  ) {
    return this.service.update(id, body, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.service.delete(id, userId);
  }

  @Get('dashboard')
  getDashboard() {
    return this.service.getDashboard();
  }
}
