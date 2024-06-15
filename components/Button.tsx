"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={"btn btn-success text-white"}
      disabled={pending}
    >
      Add
    </button>
  );
}
