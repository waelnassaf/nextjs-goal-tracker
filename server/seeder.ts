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

    // Create categories
    const categories = [
      {
        name: "My dad",
        user: savedUsers[0]._id, // Associate category with user John Doe
        order: 1, // Set the order
      },
      {
        name: "Fitness",
        user: savedUsers[0]._id, // Associate category with user John Doe
        order: 2, // Set the order
      },
      {
        name: "Travel",
        user: savedUsers[0]._id, // Associate category with user John Doe
        order: 3, // Set the order
      },
      {
        name: "Family",
        user: savedUsers[1]._id, // Associate category with user Jane Smith
        order: 1, // Set the order
      },
      {
        name: "Career",
        user: savedUsers[1]._id, // Associate category with user Jane Smith
        order: 2, // Set the order
      },
    ];

    const savedCategories = await Category.insertMany(categories, {
      session,
    });

    // Create goals
    const goals = [
      {
        name: "Go to my dad",
        category: savedCategories[0]._id, // Associate goal with category My dad
        user: savedUsers[0]._id, // Associate goal with user John Doe
        complete: false,
      },
      {
        name: "Congratulate him",
        category: savedCategories[0]._id, // Associate goal with category My dad
        user: savedUsers[0]._id, // Associate goal with user John Doe
        complete: false,
      },
      {
        name: "Lose 10 pounds",
        category: savedCategories[1]._id, // Associate goal with category Fitness
        user: savedUsers[0]._id, // Associate goal with user John Doe
        complete: false,
      },
      {
        name: "Run a marathon",
        category: savedCategories[1]._id, // Associate goal with category Fitness
        user: savedUsers[0]._id, // Associate goal with user John Doe
        complete: false,
      },
      {
        name: "Visit Paris",
        category: savedCategories[2]._id, // Associate goal with category Travel
        user: savedUsers[0]._id, // Associate goal with user John Doe
        complete: false,
      },
      {
        name: "Visit London",
        category: savedCategories[2]._id, // Associate goal with category Travel
        user: savedUsers[0]._id, // Associate goal with user John Doe
        complete: false,
      },
      {
        name: "Spend time with family",
        category: savedCategories[3]._id, // Associate goal with category Family
        user: savedUsers[1]._id, // Associate goal with user Jane Smith
        complete: false,
      },
      {
        name: "Attend family reunion",
        category: savedCategories[3]._id, // Associate goal with category Family
        user: savedUsers[1]._id, // Associate goal with user Jane Smith
        complete: false,
      },
      {
        name: "Get a promotion",
        category: savedCategories[4]._id, // Associate goal with category Career
        user: savedUsers[1]._id, // Associate goal with user Jane Smith
        complete: false,
      },
      {
        name: "Enhance skills",
        category: savedCategories[4]._id, // Associate goal with category Career
        user: savedUsers[1]._id, // Associate goal with user Jane Smith
        complete: false,
      },
    ];

    const savedGoals = await Goal.insertMany(goals, { session });

    // Update categories and users with their goals
    for (const goal of savedGoals) {
      await Category.findByIdAndUpdate(
        goal.category,
        { $push: { goals: goal._id } },
        { session },
      );

      await User.findByIdAndUpdate(
        goal.user,
        { $push: { goals: goal._id } },
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
