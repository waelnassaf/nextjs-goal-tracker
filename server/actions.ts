"use server";

import mongoose from "mongoose";
import dbConnect from "@/server/dbConnect";
import User from "@/models/User";
import Goal from "@/models/Goal";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StateResponse } from "@/types";

// export const getUserWithGoals = async (userId: string) => {
//   try {
//     await dbConnect();
//     const user = await User.findById(userId)
//       .populate({
//         path: "goals",
//         populate: { path: "category", model: "Category" },
//       })
//       .lean();
//     // Convert any Buffers or other non-serializable types here
//     if (user) {
//       const serializedUser = JSON.parse(
//         JSON.stringify(user, (key, value) =>
//           value instanceof Buffer ? value.toString("base64") : value,
//         ),
//       );
//       console.log(serializedUser);
//       return serializedUser;
//     }
//   } catch (error) {
//     console.log("Failed to retrieve user with goals", error);
//     throw new Error("Error fetching user with goals");
//   }
// };
//
// export const getUserGoalsWithCategories = async (userId: string) => {
//   try {
//     const userWithGoals = await User.findById(userId).populate({
//       path: "goals",
//       populate: {
//         path: "category",
//         model: "Category",
//       },
//     });
//
//     if (!userWithGoals) {
//       throw new Error("User not found");
//     }
//
//     return userWithGoals.goals;
//   } catch (error) {
//     console.error("Error fetching user goals with categories:", error);
//     throw error;
//   }
// };

export const toggleGoalComplete = async (goalId: string): Promise<void> => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const goal = await Goal.findById(goalId).session(session);
    console.log(goal);
    if (!goal) {
      throw new Error("Goal not found");
    }

    // Toggle the 'complete' field
    goal.complete = !goal.complete;

    // Save the updated goal within the transaction
    await goal.save({ session });

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
    /*
     *  -findOneAndDelete() returns the deleted document after having deleted it
     *  (in case you need its contents after the delete operation);
     *  -deleteOne() is used to delete a single document
     */
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

export const addGoal = async (categoryId: string, goalName: string) => {
  await dbConnect(); // Assuming dbConnect handles mongoose connection

  try {
    // Validate category existence (optional, based on your app logic)
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    // Create a new Goal instance
    const newGoal = new Goal({
      name: goalName,
      category: categoryId,
      complete: false,
    });

    // Save the new Goal document
    await newGoal.save();
    revalidatePath("/");

    console.log("New goal added successfully:", newGoal);

    return newGoal.toJSON(); // Returning as plain JSON object
  } catch (error) {
    console.error("Failed to add goal:", error);
    throw new Error("Failed to add goal");
  }
};

export const getFullUserData = async (userId: string) => {
  try {
    await dbConnect();

    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "user",
          as: "categories",
        },
      },
      {
        $lookup: {
          from: "goals",
          localField: "categories._id",
          foreignField: "category",
          as: "goals",
        },
      },
      {
        $addFields: {
          categories: {
            $map: {
              input: "$categories",
              as: "category",
              in: {
                $mergeObjects: [
                  "$$category",
                  {
                    goals: {
                      $filter: {
                        input: "$goals",
                        as: "goal",
                        cond: { $eq: ["$$goal.category", "$$category._id"] },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          goalsEndDate: 1,
          categories: {
            _id: 1,
            name: 1,
            user: 1,
            order: 1,
            goals: {
              _id: 1,
              name: 1,
              complete: 1,
            },
          },
        },
      },
    ]);
    console.log(result[0]);
    return JSON.parse(JSON.stringify(result[0]));
  } catch (error) {
    console.error("Failed to retrieve user categories with goals:", error);
    throw new Error("Error fetching user categories with goals");
  }
};

export async function createGroup(
  state: StateResponse,
  formData: FormData,
): Promise<StateResponse> {
  const userId = formData.get("userId") as string;
  const groupText = formData.get("groupText") as string;

  // console.log(userId + " " + groupText);
  if (groupText.trim() === "") {
    return { message: "Missing Field. Failed to Create Group.", type: "error" };
  }
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId).session(session);
    if (!user) {
      return {
        message: "Unauthorized access",
        type: "error",
      };
    }
    // Find the highest order for the user's categories
    const highestOrderCategory = await Category.findOne({ user: userId })
      .sort({ order: -1 })
      .session(session);

    const newOrder = highestOrderCategory ? highestOrderCategory.order + 1 : 1;

    const category = new Category({
      name: groupText,
      user: userId,
      order: newOrder,
      goals: [],
    });

    await category.save({ session });
    await session.commitTransaction();
    return {
      message: `${category.name} was created successfully!`,
      type: "success",
    };
  } catch (error) {
    await session.abortTransaction();
    return {
      message: `Failed to create group! Please try again`,
      type: "error",
    };
  } finally {
    await session.endSession();
  }
  revalidatePath("/");
  redirect("/");
}

export const deleteGroup = async (groupId: string): Promise<void> => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the category to be deleted
    const category = await Category.findById(groupId).session(session);
    if (!category) {
      throw new Error("Category not found");
    }

    // Delete all goals associated with the category
    await Goal.deleteMany({ category: groupId }).session(session);

    // Delete the category itself
    await category.deleteOne({ session });

    console.log("Group and associated goals deleted successfully");

    await session.commitTransaction();
  } catch (error) {
    console.error("Failed to delete group:", error);
    await session.abortTransaction();
    throw new Error("Failed to delete group and associated goals");
  } finally {
    await session.endSession();
  }
};
