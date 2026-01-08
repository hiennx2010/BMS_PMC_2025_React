import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


@Schema({ timestamps: true })
export class User extends Document {
@Prop({ required: true })
email: string;


@Prop({ default: 0 })
point: number;


@Prop()
last_check_in?: Date;


@Prop()
last_get_check_in_rewards?: Date;
}


export const UserSchema = SchemaFactory.createForClass(User);