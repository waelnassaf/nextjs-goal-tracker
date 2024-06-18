import { FaSignInAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { GoGoal } from "react-icons/go";
import React from "react";
import {
  FaRegCalendarCheck,
  FaLayerGroup,
  FaMobileAlt,
  FaGithub,
} from "react-icons/fa";

export default async function Home() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
      <section className="bg-white py-12 md:flex">
        <div className="flex-1">
          <h1 className="text-5xl font-bold">
            <GoGoal
              className="text-5xl inline-block mr-5"
              style={{ color: "red" }}
            />
            Goals Tracker App
          </h1>
          <p className="my-5 text-xl">
            Track your goals efficiently with deadlines, categories, and a
            seamless user experience.
          </p>
        </div>
        <div className="flex-[2] flex flex-col gap-4 items-center justify-center">
          <Image
            src="/screenshots/2.png"
            alt={"Hero section screenshot"}
            width={400}
            height={500}
            className="hidden md:block"
          />
          <Link href="/signup" className="btn btn-primary">
            Get Started
            {/*<FaSignInAlt className="text-xl" />*/}
          </Link>
        </div>
      </section>

      <section className="bg-gray-100 py-12 my-6 text-center">
        <h2 className="text-4xl font-bold mb-5">Features</h2>
        <ul className=" mx-auto max-w-lg flex justify-between">
          <li className="flex flex-col gap-3 items-center p-3">
            <FaRegCalendarCheck
              className="text-5xl inline-block"
              style={{ color: "#0099de" }}
            />
            <span>Set long-term end date</span>
          </li>
          <li className="flex flex-col gap-3 items-center p-3">
            <FaLayerGroup
              className="text-5xl inline-block"
              style={{ color: "grey" }}
            />
            <span>Organize goals into groups</span>
          </li>
          <li className="flex flex-col gap-3 items-center p-3">
            <FaMobileAlt
              className="text-5xl inline-block"
              style={{ color: "orange" }}
            />
            <span>Responsive, mobile-friendly design</span>
          </li>
        </ul>
      </section>

      <section className="flex-col gap-4 md:flex-row flex justify-around my-6">
        <p>
          Made with ❤️ by
          <Link href="https://x.com/waelnassaf/" className="text-blue-500">
            {" "}
            Wael Assaf
          </Link>
        </p>
        <p>
          This project is free on github. Give us a star!{" "}
          <Link href="https://github.com/waelnassaf/nextjs-goal-tracker">
            <FaGithub className="text-lg inline-block" />
          </Link>
        </p>
      </section>
    </div>
  );
}
