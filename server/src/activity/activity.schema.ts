import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    enum: ['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE'],
    required: true,
  })
  action: string;

  @Prop({ default: 'CUSTOMER' })
  entity: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  entityId: Types.ObjectId;

  @Prop()
  customerName: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  message: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
