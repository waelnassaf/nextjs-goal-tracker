"use client";

import React, { useState } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { deleteGoal } from "@/server/actions";
import { Goal } from "@/types";
import { toast } from "react-toastify";

const DeleteIcon = ({
  goal,
  onDelete,
}: {
  goal: Goal;
  onDelete: (goalId: string) => void;
}) => {
  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteGoal(goal._id); // Call your deleteGoal function here
        onDelete(goal._id); // Update UI after successful deletion
        toast.success("Goal deleted successfully!");
      } catch (error) {
        console.error("Failed to delete goal:", error);
        toast.error("Failed to delete goal: " + error.message);
      }
    }
  };

  return (
    <button onClick={handleDeleteClick}>
      <MdOutlineDelete className="h-5 w-5 text-red-500 cursor-pointer" />
    </button>
  );
};

export default DeleteIcon;
