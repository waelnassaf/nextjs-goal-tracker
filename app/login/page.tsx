// import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="text-white text-center bg-blue-500 rounded-lg py-5">
          Login to Goal Tracker
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
