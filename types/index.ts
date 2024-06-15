import { Document, Types } from "mongoose";
import { MouseEventHandler } from "react";

// User interface with Mongoose Document
export interface User extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  goalsEndDate: Date;
}

// Goal interface with Mongoose Document
export interface Goal extends Document {
  _id: Types.ObjectId;
  name: string;
  category: Category;
  complete: boolean;
  user: Types.ObjectId | User;
}

export interface Category extends Document {
  _id: Types.ObjectId;
  name: string;
  user: User;
  order: number;
  goals: Goal[];
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  goalsEndDate: string;
  categories: Category[];
}

export type TimeDifference = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export interface CustomButtonProps {
  isDisabled?: boolean;
  btnType?: "button" | "submit";
  containerStyles?: string;
  textStyles?: string;
  title: string;
  rightIcon?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface StateResponse {
  message: string;
  type: "success" | "error" | "";
}
