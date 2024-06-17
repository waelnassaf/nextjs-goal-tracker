import { FiPlusCircle } from "react-icons/fi";
import { createGoal } from "@/server/actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { StateResponse } from "@/types";
import { Button } from "@/components/Button";
import { toast } from "react-toastify";

const AddNewGoal = ({ cat }: { cat: string }) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [state, dispatch] = useFormState<StateResponse, FormData>(createGoal, {
    message: "",
    type: "",
  });

  useEffect(() => {
    if (state.type === "error") {
      toast.error(state.message);
    }
    if (state.type === "success") {
      toast.success(state.message);
      setFormVisible(false);
    }
  }, [state]);

  return (
    <>
      <FiPlusCircle
        className="h-7 w-7 text-black-500 cursor-pointer"
        onClick={() => {
          setFormVisible(true);
        }}
      />
      {isFormVisible && (
        <form className="flex gap-2 mt-2" action={dispatch}>
          <input
            type="text"
            name="goalName"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
          <input type="hidden" name="categoryId" value={cat} />

          <Button />
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => setFormVisible(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </>
  );
};

export default AddNewGoal;
