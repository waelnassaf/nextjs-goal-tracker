import { Document, Types } from "mongoose";

// User interface with Mongoose Document
export interface User extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  goals: Types.ObjectId[] | Goal[];
  goalsEndDate?: Date;
}

// Goal interface with Mongoose Document
export interface Goal extends Document {
  _id: Types.ObjectId;
  name: string;
  category: Category;
  complete: boolean;
  user: User | Types.ObjectId;
}

export interface Category extends Document {
  _id: Types.ObjectId;
  name: string;
}
