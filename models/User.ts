import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: [true, "Name is required!"] },
  email: { type: String, required: [true, "Email is required!"] },
  password: { type: String, required: [true, "Password is required!"] },
  goalsEndDate: { type: Date, required: false },
});

const User = models.User || model("User", UserSchema);

export default User;
