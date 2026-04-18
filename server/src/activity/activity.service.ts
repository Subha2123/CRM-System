import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity, ActivityDocument } from './activity.schema';
import { Model } from 'mongoose';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
  ) {}

  async log({
    userId,
    action,
    customer,
    metadata = {},
  }: {
    userId: any;
    action: string;
    customer: any;
    metadata?: any;
  }) {
    let message = '';

    switch (action) {
      case 'CREATE':
        message = `created customer ${customer.name}`;
        break;

      case 'UPDATE':
        message = `updated customer ${customer.name}`;
        break;

      case 'DELETE':
        message = `deleted customer ${customer.name}`;
        break;

      case 'STATUS_CHANGE':
        message = `changed status of ${customer.name} to ${customer.status}`;
        break;
    }

    return this.activityModel.create({
      userId,
      action,
      entityId: customer._id,
      customerName: customer.name,
      metadata,
      message,
    });
  }

  async findRecent(limit = 10) {
    return this.activityModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name');
  }
}
