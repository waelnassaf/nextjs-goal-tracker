import Hero from "@/components/Hero";
import Goals from "@/components/Goals";
import { getUserWithGoals } from "@/server/actions";

export default async function Home() {
  const user = await getUserWithGoals("66682563f22e5ce53e0eecb9");
  return (
    <main>
      <Hero user={user} />
      <Goals user={user} />
    </main>
  );
}
