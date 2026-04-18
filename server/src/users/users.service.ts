import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: data.email });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = new this.userModel(data);
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).lean();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
