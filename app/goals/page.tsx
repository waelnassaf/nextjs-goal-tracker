import Hero from "@/components/Hero";
import Goals from "@/components/Goals";
import { getFullUserData } from "@/server/actions";
// import TestData from "@/components/TestData";
// import { seedDB } from "@/server/seeder";
import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const user = await getFullUserData(session?.user?.id);

  return (
    <main>
      <div></div>
      <Hero endDate={user.goalsEndDate} id={user._id.toString()} />
      <Goals user={user} />
      <SignOutButton />
    </main>
  );
}
