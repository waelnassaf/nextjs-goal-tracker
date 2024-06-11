"use client";

import React, { useState } from "react";
import { RiDraggable } from "react-icons/ri";
import CheckBox from "@/components/CheckBox";
import DeleteIcon from "@/components/DeleteIcon";
import { User, Goal } from "@/types";

const Goals = ({ user }: { user: User }) => {
  // Group goals by category
  const [goalsByCategory, setGoalsByCategory] = useState(
    user.goals.reduce((acc, goal) => {
      const categoryName = goal.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(goal);
      return acc;
    }, {}),
  );

  const handleGoalDelete = (goalId: string) => {
    const updatedGoals = { ...goalsByCategory };
    Object.keys(updatedGoals).forEach((categoryName) => {
      updatedGoals[categoryName] = updatedGoals[categoryName].filter(
        (goal) => goal._id !== goalId,
      );
    });
    setGoalsByCategory(updatedGoals);
  };

  return (
    <section className="max-w-md m-4 p-4">
      <h1 className="text-5xl max-w-xl">Goals</h1>
      {Object.entries(goalsByCategory).map(([categoryName, goals]) => (
        <div key={categoryName} className="my-4 p-3">
          <h2 className="text-3xl flex items-center">
            <RiDraggable />
            {categoryName}
          </h2>
          <ul className="pl-4 text-2xl">
            {goals.map((goal: Goal) => (
              <li key={goal._id.toString()} className="my-2">
                <div className="form-control">
                  <label className="label cursor-pointer flex items-center">
                    <CheckBox goal={goal} />
                    <span className="label-text">{goal.name}</span>
                  </label>
                  <DeleteIcon goal={goal} onDelete={handleGoalDelete} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Goals;
