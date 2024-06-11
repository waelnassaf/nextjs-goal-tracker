import mongoose from "mongoose";
// const Goal = require("../models/Goal.ts");
// const User = require("../models/User.js");
// const Category = require("../models/Category.ts");
import Goal from "../models/Goal";
import User from "../models/User";
import Category from "../models/Category";

// Connect to the MongoDB database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database.");
    seedDatabase().then(() => {
      console.log("Seeding completed.");
      mongoose.connection.close();
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

async function seedDatabase() {
  // Clear existing data
  await User.deleteMany({});
  await Goal.deleteMany({});
  await Category.deleteMany({});

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

  const createdCategories = await Category.insertMany(categories);

  // Create users
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: "password123", // Note: In a real application, make sure to hash passwords
      goals: [],
      goalsEndDate: new Date("2024-12-31"),
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      goals: [],
      goalsEndDate: new Date("2024-12-31"),
    },
  ];

  const createdUsers = await User.insertMany(users);

  // Create goals and associate them with users and categories
  const goals = [
    {
      name: "Get a promotion",
      category: createdCategories.find((cat) => cat.name === "Career")._id,
      complete: false,
      user: createdUsers[0]._id,
    },
    {
      name: "Run a marathon",
      category: createdCategories.find((cat) => cat.name === "Health")._id,
      complete: false,
      user: createdUsers[0]._id,
    },
    {
      name: "Earn a degree",
      category: createdCategories.find((cat) => cat.name === "Education")._id,
      complete: false,
      user: createdUsers[1]._id,
    },
    {
      name: "Save $10,000",
      category: createdCategories.find((cat) => cat.name === "Finance")._id,
      complete: false,
      user: createdUsers[1]._id,
    },
  ];

  const createdGoals = await Goal.insertMany(goals);

  // Update users with their goals
  await User.updateOne(
    { _id: createdUsers[0]._id },
    { goals: [createdGoals[0]._id, createdGoals[1]._id] },
  );
  await User.updateOne(
    { _id: createdUsers[1]._id },
    { goals: [createdGoals[2]._id, createdGoals[3]._id] },
  );

  console.log("Database seeded successfully");
}

seedDatabase();
