import { Schema, model, models } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: [true, "Category name is required!"] },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
