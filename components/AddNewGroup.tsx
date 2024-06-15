import { createGroup } from "@/server/actions";
import { SubmitButton } from "@/components/Button";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { StateResponse } from "@/types";

const AddNewGroup = ({ userId }: { userId: string }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [state, dispatch] = useFormState<StateResponse, FormData>(createGroup, {
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
      {formVisible ? (
        <form action={dispatch} className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            name="groupText"
          />
          <input type="hidden" name="userId" value={userId} />
          <SubmitButton />
          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              setFormVisible(false);
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          className="btn btn-ou tline"
          type={"button"}
          onClick={() => {
            setFormVisible(true);
          }}
        >
          Add new group
        </button>
      )}
    </>
  );
};

export default AddNewGroup;
