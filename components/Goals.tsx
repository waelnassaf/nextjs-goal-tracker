"use client";

import React from "react";
import { RiDraggable } from "react-icons/ri";
import CheckBox from "@/components/CheckBox";
import DeleteIcon from "@/components/DeleteIcon";
import { UserResponse, Goal, Category } from "@/types";
import { deleteGroup } from "@/server/actions"; // Assuming deleteGroup action is imported
import AddNewGroup from "@/components/AddNewGroup";
import { toast } from "react-toastify";
import AddNewGoal from "@/components/AddNewGoal";

const Goals = ({ user }: { user: UserResponse }) => {
  const handleDeleteGroup = async (categoryId: string) => {
    if (confirm("Do you want to delete this group?")) {
      try {
        await deleteGroup(categoryId);
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
      {user.categories.map((category: Category) => (
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
                      <DeleteIcon goal={goal} />
                    </div>
                  </label>
                </div>
              </li>
            ))}
            <AddNewGoal cat={category._id.toString()} />
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
