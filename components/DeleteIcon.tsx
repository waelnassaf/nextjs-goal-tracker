import { MdOutlineDelete } from "react-icons/md";
import { deleteGoal } from "@/server/actions";
import { Goal } from "@/types";
import { toast } from "react-toastify";

const DeleteIcon = ({ goal }: { goal: Goal }) => {
  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteGoal(goal._id.toString());
        toast.success("Goal deleted successfully!");
      } catch (error) {
        console.error("Failed to delete goal:", error);
        toast.error("Failed to delete goal, please try again.");
      }
    }
  };

  return (
    <button onClick={handleDeleteClick}>
      <MdOutlineDelete className="h-7 w-7 text-red-500 cursor-pointer" />
    </button>
  );
};

export default DeleteIcon;
