import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { ActivityService } from 'src/activity/activity.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
    private activityService: ActivityService,
  ) {}

  async create(data: Partial<Customer>, userId: string) {
    const existing = await this.customerModel.findOne({ email: data.email });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    try {
      const insert = await this.customerModel.create(data);
      await this.activityService.log({
        userId: userId,
        action: 'CREATE',
        customer: insert,
      });
      return insert;
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Failed to create customer');
    }
  }

  async findAll(query: { search?: string; status?: string }) {
    const filter: any = {
      is_active: true,
    };

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.status) {
      filter.status = query.status;
    }

    const projection: any = {
      name: 1,
      email: 1,
      phone: 1,
      company: 1,
      status: 1,
      createdAt: 1,
    };

    return this.customerModel
      .find(filter, projection)
      .sort({ createdAt: -1 })
      .lean();
  }

  async update(id: string, data: any, userId: string) {
    const getOldData = await this.customerModel.findById(id);

    const updated = await this.customerModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    await this.activityService.log({
      userId,
      action: 'UPDATE',
      customer: updated,
      metadata: {
        before: getOldData,
        after: updated,
      },
    });
  }

  async delete(id: string, userId: string) {
    const deleteCustomer = await this.customerModel.findByIdAndUpdate(
      id,
      {
        is_active: false,
      },
      { new: true },
    );
    await this.activityService.log({
      userId,
      action: 'DELETE',
      customer: deleteCustomer,
    });
    return deleteCustomer;
  }

  async getDashboard() {
    const totalCustomers = await this.customerModel.find({}).countDocuments();
    const recentCustomers = await this.customerModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email status createdAt');
    const result = await this.customerModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    return {
      total: totalCustomers,
      counts: result,
      customers: recentCustomers,
    };
  }
}
