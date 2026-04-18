import { Controller, Get } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getActivity() {
    const data = await this.activityService.findRecent();

    return data.map((a: any) => ({
      user: a.userId?.name || 'User',
      message: a.message,
      time: a.createdAt,
    }));
  }
}
