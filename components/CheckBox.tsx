import { toggleGoalComplete } from "@/server/actions";
import { Goal } from "@/types";
import { toast } from "react-toastify";

const CheckBox = ({ goal }: { goal: Goal }) => {
  const handleCheckboxChange = async () => {
    try {
      await toggleGoalComplete(goal._id.toString());
      toast.success("Goal state updated successfully!");
    } catch (error) {
      console.error("Failed to toggle goal complete status:", error);
      toast.error("Failed to update goal: ");
    }
  };

  return (
    <input
      type="checkbox"
      defaultChecked={goal.complete}
      className="checkbox mr-2"
      onChange={handleCheckboxChange}
    />
  );
};

export default CheckBox;
