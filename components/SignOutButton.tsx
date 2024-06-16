import { signOut } from "@/auth";
import { FaPowerOff } from "react-icons/fa6";

const SignOutButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="fixed bottom-0 right-0 mb-4 mr-4 flex h-[48px] grow
        items-center justify-center gap-2 rounded-md bg-gray-50 p-3
        text-sm font-medium hover:bg-sky-100 hover:text-blue-600
        md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <FaPowerOff className="w-6" />
        <span className="hidden md:block">Sign Out</span>
      </button>
    </form>
  );
};

export default SignOutButton;
