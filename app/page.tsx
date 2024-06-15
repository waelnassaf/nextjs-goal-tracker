import Hero from "@/components/Hero";
import Goals from "@/components/Goals";
import { getFullUserData } from "@/server/actions";
// import TestData from "@/components/TestData";
// import { seedDB } from "@/server/seeder";

export default async function Home() {
  const user = await getFullUserData("666980120b5c919fd83b6b1d");
  // const seed = seedDB();
  return (
    <main>
      <Hero endDate={user.goalsEndDate} id={user._id.toString()} />
      <Goals user={user} />
    </main>
  );
}
