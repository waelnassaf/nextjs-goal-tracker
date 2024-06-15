import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: [true, "Category name is required!"] },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: Number, default: 0, unique: true },
  goals: [{ type: Schema.Types.ObjectId, ref: "Goal" }],
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
