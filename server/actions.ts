"use server";

import mongoose from "mongoose";
import dbConnect from "@/server/dbConnect";
import User from "@/models/User";
import Goal from "@/models/Goal";

export const getUserWithGoals = async (userId: string) => {
  try {
    await dbConnect();
    const user = await User.findById(userId)
      .populate({
        path: "goals",
        populate: { path: "category", model: "Category" },
      })
      .lean();
    // Convert any Buffers or other non-serializable types here
    if (user) {
      const serializedUser = JSON.parse(
        JSON.stringify(user, (key, value) =>
          value instanceof Buffer ? value.toString("base64") : value,
        ),
      );
      console.log(serializedUser);
      return serializedUser;
    }
  } catch (error) {
    console.log("Failed to retrieve user with goals", error);
    throw new Error("Error fetching user with goals");
  }
};

export const getUserGoalsWithCategories = async (userId) => {
  try {
    const userWithGoals = await User.findById(userId).populate({
      path: "goals",
      populate: {
        path: "category",
        model: "Category",
      },
    });

    if (!userWithGoals) {
      throw new Error("User not found");
    }

    return userWithGoals.goals;
  } catch (error) {
    console.error("Error fetching user goals with categories:", error);
    throw error;
  }
};

// export const updateGoalState = async (goalID) => {
//   await dbConnect();
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const goal = await Goal.findById(goalId);
//     if (!goal) {
//       throw new Error("Goal not found");
//     }
//     // Toggle the 'complete' field
//     goal.complete = !goal.complete;
//     // Save the updated goal
//     await goal.save();
//     console.log("Goal complete status toggled successfully:", goal);
//     await session.commitTransaction();
//     toast.success("Goal state updated successfully!");
//   } catch (error) {
//     console.error("Failed to toggle goal complete status:", error);
//     await session.abortTransaction();
//     toast.error("Failed to update goal: " + error.message);
//     throw new Error("Failed to update goal: " + error.message);
//   } finally {
//     await session.endSession();
//   }
// };

export const toggleGoalComplete = async (goalId: string): Promise<void> => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const goal = await Goal.findOne({ _id: goalId });
    if (!goal) {
      throw new Error("Goal not found");
    }

    // Toggle the 'complete' field
    goal.complete = !goal.complete;

    // Save the updated goal within the transaction
    await goal.save();
    await session.commitTransaction();

    console.log("Goal complete status toggled successfully:", goal);

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    console.error("Failed to toggle goal complete status:", error);
    await session.abortTransaction();
    throw new Error("Failed to toggle goal complete status");
  } finally {
    await session.endSession();
  }
};

export const deleteGoal = async (goalId: string): Promise<void> => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const goal = await Goal.findOneAndDelete({ _id: goalId }); // Find and delete the goal
    if (!goal) {
      throw new Error("Goal not found");
    }

    console.log("Goal deleted successfully:", goal);

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    console.error("Failed to delete goal:", error);
    await session.abortTransaction();
    throw new Error("Failed to delete goal");
  } finally {
    await session.endSession();
  }
};

export const updateGoalsDate = async (
  userId: string,
  newDate: Date,
): Promise<void> => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { goalsEndDate: newDate },
      { new: true },
    );

    if (!user) {
      throw new Error("User not found");
    }

    console.log("Goals end date updated successfully:", user.goalsEndDate);

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    console.error("Failed to update goals end date:", error);
    await session.abortTransaction();
    throw new Error("Failed to update goals end date");
  } finally {
    await session.endSession();
  }
};
