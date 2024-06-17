// import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="text-white text-center bg-blue-500 rounded-lg py-5">
            Signup to use Goal Tracker
          </div>
          <LoginForm />
        </div>
        <p className="text-gray-500">
          Have an account already?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </main>
    </>
  );
}
