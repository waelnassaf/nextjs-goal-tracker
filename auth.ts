import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User as UserType } from "@/types";
import User from "@/models/User";
import bcrypt from "bcrypt";
import dbConnect from "@/server/dbConnect";

async function getUser(email: string): Promise<UserType | null | undefined> {
  try {
    await dbConnect();
    // return JSON.parse(JSON.stringify(user[0]));
    return await User.findOne({ email: email });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("success found user: " + user);
          if (passwordsMatch) return user;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
