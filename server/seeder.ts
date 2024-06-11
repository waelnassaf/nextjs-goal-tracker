"use server";

import mongoose from "mongoose";
import dbConnect from "@/server/dbConnect";
import Category from "@/models/Category";
import Goal from "@/models/Goal";
import User from "@/models/User";

export const seedDB = async () => {
  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Clear existing data
    await Category.deleteMany({}, { session });
    await Goal.deleteMany({}, { session });
    await User.deleteMany({}, { session });

    // Create categories
    const categories = [
      { name: "Career" },
      { name: "Health" },
      { name: "Education" },
      { name: "Finance" },
      { name: "Relationship" },
      { name: "Personal Development" },
      { name: "Travel" },
      { name: "Home Improvement" },
      { name: "Creativity" },
      { name: "Spiritual" },
    ];

    const savedCategories = await Category.insertMany(categories, { session });

    // Create users with goalsEndDate
    const users = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        goalsEndDate: new Date("2028-06-11"), // Set the goalsEndDate
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        goalsEndDate: new Date("2028-06-12"), // Set the goalsEndDate
      },
    ];

    const savedUsers = await User.insertMany(users, { session });

    // Create goals
    const goals = [
      {
        name: "Get a promotion",
        category: savedCategories[0]._id,
        user: savedUsers[0]._id,
        complete: false,
      },
      {
        name: "Switch to a new industry",
        category: savedCategories[0]._id,
        user: savedUsers[1]._id,
        complete: false,
      },
      {
        name: "Lose 10 pounds",
        category: savedCategories[1]._id,
        user: savedUsers[0]._id,
        complete: false,
      },
      {
        name: "Run a marathon",
        category: savedCategories[1]._id,
        user: savedUsers[1]._id,
        complete: false,
      },
      {
        name: "Earn a degree",
        category: savedCategories[2]._id,
        user: savedUsers[0]._id,
        complete: false,
      },
      {
        name: "Save $10,000",
        category: savedCategories[3]._id,
        user: savedUsers[1]._id,
        complete: false,
      },
      {
        name: "Get engaged",
        category: savedCategories[4]._id,
        user: savedUsers[0]._id,
        complete: false,
      },
      {
        name: "Practice mindfulness daily",
        category: savedCategories[5]._id,
        user: savedUsers[1]._id,
        complete: false,
      },
      {
        name: "Visit a new country",
        category: savedCategories[6]._id,
        user: savedUsers[0]._id,
        complete: false,
      },
      {
        name: "Renovate the kitchen",
        category: savedCategories[7]._id,
        user: savedUsers[1]._id,
        complete: false,
      },
      {
        name: "Write a book",
        category: savedCategories[8]._id,
        user: savedUsers[0]._id,
        complete: false,
      },
      {
        name: "Meditate daily",
        category: savedCategories[9]._id,
        user: savedUsers[1]._id,
        complete: false,
      },
    ];

    const savedGoals = await Goal.insertMany(goals, { session });

    // Update users with their goals
    for (const user of savedUsers) {
      const userGoals = savedGoals
        .filter((goal) => goal.user.toString() === user._id.toString())
        .map((goal) => goal._id);
      await User.findByIdAndUpdate(
        user._id,
        { $set: { goals: userGoals } },
        { session },
      );
    }

    await session.commitTransaction();
    console.log("Database seeded successfully");
  } catch (error) {
    await session.abortTransaction();
    console.error("Seeding failed:", error);
  } finally {
    session.endSession();
    mongoose.disconnect();
  }
};
