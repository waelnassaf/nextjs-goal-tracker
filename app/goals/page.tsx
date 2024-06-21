import Hero from "@/components/Hero";
import Goals from "@/components/Goals";
import { getFullUserData } from "@/server/actions";
import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/auth";
// import TestData from "@/components/TestData";
// import { seedDB } from "@/server/seeder";

export default async function GoalsPage() {
  const session = await auth();
  const user = await getFullUserData(session?.user?.id);

  return (
    <main>
      <Hero endDate={user.goalsEndDate} id={user._id.toString()} />
      <Goals user={user} />
      <SignOutButton />
    </main>
  );
}
