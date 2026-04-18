import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
  ) {}

  async create(data: Partial<Customer>) {
    const existing = await this.customerModel.findOne({ email: data.email });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    try {
      return await this.customerModel.create(data);
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw new BadRequestException('Failed to create customer');
    }
  }

  async findAll(query: { search?: string; status?: string }) {
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.status) {
      filter.status = query.status;
    }

    return this.customerModel
      .find(filter)
      .select('name email phone company status createdDate')
      .lean();
  }

  async update(id: string, data: any) {
    return this.customerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.customerModel.findByIdAndDelete(id);
  }

  async getDashboard() {
    const totalCustomers = await this.customerModel.find({}).countDocuments();
    const result = await this.customerModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
    return { total: totalCustomers, counts: result };
  }
}
