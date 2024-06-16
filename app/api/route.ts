import { NextResponse } from "next/server";
// import { getFullUserData } from "@/server/actions";

// This is an api Route to view a sample of the db return
export async function GET() {
  // const res = await getFullUserData("666980120b5c919fd83b6b1d");
  // return NextResponse.json(res);
  return NextResponse.json({ message: "You're good!" }, { status: 200 });
}
