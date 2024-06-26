import { Schema, model, models } from "mongoose";

const GoalSchema = new Schema({
  name: { type: String, required: [true, "Goal name is required!"] },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  complete: { type: Boolean, default: false },
});

const Goal = models.Goal || model("Goal", GoalSchema);

export default Goal;
