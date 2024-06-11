"use client";

import { toggleGoalComplete } from "@/server/actions"; // Import the toggleGoalComplete function
import { Goal } from "@/types";
import { toast } from "react-toastify";

const CheckBox = ({ goal }: { goal: Goal }) => {
  const handleCheckboxChange = async () => {
    try {
      await toggleGoalComplete(goal._id); // Call toggleGoalComplete with the goal ID
      toast.success("Goal state updated successfully!");
    } catch (error) {
      console.error("Failed to toggle goal complete status:", error);
      toast.error("Failed to update goal: " + error.message);
    }
  };

  return (
    <input
      type="checkbox"
      defaultChecked={goal.complete}
      className="checkbox mr-2"
      onChange={handleCheckboxChange} // Attach the handleCheckboxChange function to the onChange event
    />
  );
};

export default CheckBox;
