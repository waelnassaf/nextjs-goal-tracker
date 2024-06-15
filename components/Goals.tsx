"use client";

import React, { useState, Suspense } from "react";
import { RiDraggable } from "react-icons/ri";
import CheckBox from "@/components/CheckBox";
import DeleteIcon from "@/components/DeleteIcon";
import { UserResponse, Goal, Category } from "@/types";
import { FiPlusCircle } from "react-icons/fi";
import { addGoal, deleteGroup } from "@/server/actions"; // Assuming deleteGroup action is imported
import AddNewGroup from "@/components/AddNewGroup";
import { toast } from "react-toastify";

export const revalidate = 0;

const Goals = ({ user }: { user: UserResponse }) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [userState, setUserState] = useState<UserResponse>(user);

  const handleGoalDelete = (goalId: string, categoryId: string) => {
    const updatedCategories = userState.categories.map((category: Category) => {
      if (category._id.toString() === categoryId) {
        return {
          ...category,
          goals: category.goals.filter(
            (goal) => goal._id.toString() !== goalId,
          ),
        } as Category;
      }
      return category;
    });

    setUserState({
      ...userState,
      categories: updatedCategories,
    });
  };

  const handleFormSubmit = async (
    event: React.FormEvent,
    categoryId: string,
  ) => {
    event.preventDefault();
    if (newGoal.trim() === "") return;
    try {
      const newGoalData = await addGoal(categoryId, newGoal);
      if (newGoalData) {
        const updatedCategories = userState.categories.map((category) => {
          if (category._id.toString() === categoryId) {
            return {
              ...category,
              goals: [...category.goals, newGoalData],
            } as Category;
          }
          return category;
        });

        setUserState({
          ...userState,
          categories: updatedCategories,
        });

        setNewGoal("");
        setFormVisible(false);
        toast.success("Goal added successfully!");
      }
    } catch (error) {
      console.error("Failed to add goal:", error);
      toast.error("Failed to add goal, please try again.");
    }
  };

  const handleDeleteGroup = async (categoryId: string) => {
    if (confirm("Do you want to delete this group?")) {
      try {
        await deleteGroup(categoryId);
        setUserState((prevState) => ({
          ...prevState,
          categories: prevState.categories.filter(
            (category) => category._id.toString() !== categoryId,
          ),
        }));
        toast.success("Group deleted successfully!");
      } catch (error) {
        console.error("Failed to delete group:", error);
        toast.error("Failed to delete group, please try again.");
      }
    }
  };
  return (
    <section className="max-w-md m-4 p-4">
      <h1 className="text-5xl max-w-xl">Goals</h1>
      {userState.categories.map((category: Category) => (
        <div key={category._id.toString()} className="my-6 p-3">
          <h2 className="text-3xl flex items-center">
            <RiDraggable />
            {category.name}
          </h2>
          <ul className="pl-4 text-2xl">
            {category.goals.map((goal: Goal) => (
              <li key={goal._id.toString()} className="my-2">
                <div className="form-control">
                  <label className="label cursor-pointer flex items-center justify-between">
                    <span className="label-text">{goal.name}</span>
                    <div className="flex items-center">
                      <CheckBox goal={goal} />
                      <DeleteIcon
                        goal={goal}
                        onDelete={() =>
                          handleGoalDelete(
                            goal._id.toString(),
                            category._id.toString(),
                          )
                        }
                      />
                    </div>
                  </label>
                </div>
              </li>
            ))}
            <FiPlusCircle
              className="h-7 w-7 text-black-500 cursor-pointer"
              onClick={() => {
                setActiveCategory(category._id.toString());
                setFormVisible(true);
              }}
            />
            {isFormVisible && activeCategory === category._id.toString() && (
              <form
                className="flex gap-2 mt-2"
                onSubmit={(e) => handleFormSubmit(e, category._id.toString())}
              >
                <input
                  type="text"
                  placeholder="Type here"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="input input-bordered w-full max-w-xs"
                />
                <button className="btn btn-success" type="submit">
                  Save
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => setFormVisible(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </ul>
          <button
            className="text-red-400 mr-auto text-xs"
            onClick={() => handleDeleteGroup(category._id.toString())}
          >
            Delete Group
          </button>
        </div>
      ))}
      <AddNewGroup userId={user._id.toString()} />
    </section>
  );
};

export default Goals;
