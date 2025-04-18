import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

export type SilverSubcategoryDocument = SilverSubcategory & Document;

@Schema()
export class SilverSubcategory {

    @Prop({ type: String , required : true , trim: true, index: true, unique: true, sparse: true})
    subcategoryName: string;

    @Prop({ type: Number , required : true , trim: true, index: true, unique: true, sparse: true})
    subCategoryCode: number;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Category' , index: true})
    categoryid: Types.ObjectId;

    @Prop({ type: Date,default: new Date() })
    createdAt: Date;

    @Prop({ type: Boolean , default: true })
    active: Boolean;
}

export const SilverSubcategorySchema = SchemaFactory.createForClass(SilverSubcategory);

