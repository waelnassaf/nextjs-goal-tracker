"use server";

import mongoose from "mongoose";
import dbConnect from "@/server/dbConnect";
import User from "@/models/User";
import Goal from "@/models/Goal";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";
import { StateResponse } from "@/types";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

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
    revalidatePath("/");
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

export const createGoal = async (
  state: StateResponse,
  formData: FormData,
): Promise<StateResponse> => {
  const categoryId = formData.get("categoryId") as string;
  const goalName = formData.get("goalName") as string;
  if (goalName.trim() === "") {
    return { message: "Missing Field. Failed to Create Goal.", type: "error" };
  }

  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

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
    await session.commitTransaction();

    console.log("New goal added successfully:", newGoal);

    return {
      message: `${newGoal.name} was created successfully!`,
      type: "success",
    };
  } catch (error) {
    await session.abortTransaction();
    return {
      message: `Failed to create goal! Please try again`,
      type: "error",
    };
  } finally {
    await session.endSession();
    revalidatePath("/");
  }
};

export const getFullUserData = async (userId: string | undefined) => {
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
    revalidatePath("/");
  }
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
    revalidatePath("/");
  }
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function createUser(
  state: StateResponse,
  formData: FormData,
): Promise<StateResponse> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const goalsEndDate = formData.get("goalsEndDate") as string;

  if (!name || !email || !password || !confirmPassword || !goalsEndDate) {
    return {
      message: "Missing required fields. Failed to create user.",
      type: "error",
    };
  }

  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match. Failed to create user.",
      type: "error",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return {
        message: "User with this email already exists",
        type: "error",
      };
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      goalsEndDate: goalsEndDate ? new Date(goalsEndDate) : undefined,
    });

    await user.save({ session });
    await session.commitTransaction();
    return {
      message: `${user.name} was created successfully!`,
      type: "success",
    };
  } catch (error) {
    await session.abortTransaction();
    return {
      message: `Failed to create user! Please try again`,
      type: "error",
    };
  } finally {
    await session.endSession();
    // You can add revalidation logic here if needed
    // e.g., revalidatePath("/");
    redirect("/login");
  }
}
