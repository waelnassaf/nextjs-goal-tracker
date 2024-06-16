"use client";

import { useFormStatus } from "react-dom";

export function Button() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={"btn btn-success text-white"}
      disabled={pending}
      aria-disabled={pending}
    >
      Add
    </button>
  );
}
