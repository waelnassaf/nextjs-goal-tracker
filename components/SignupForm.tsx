"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import type { NextPage } from "next";
import { BsFillPersonFill, BsKey, BsExclamationCircle } from "react-icons/bs";
import { LuUserCheck } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { useFormState, useFormStatus } from "react-dom";
import { createUser } from "@/server/actions";
import { StateResponse } from "@/types";
import { useEffect } from "react";
import { toast } from "react-toastify";

const SignupForm: NextPage = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  const [state, dispatch] = useFormState<StateResponse, FormData>(createUser, {
    message: "",
    type: "",
  });

  useEffect(() => {
    if (state?.type === "success") {
      toast.success(state.message);
    }
  }, [state]);

  const { message, type } = state;
  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        await fetch("/api/recaptcha", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        setIsVerified(true);
      }
    } catch (e) {
      setIsVerified(false);
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  function handleExpired() {
    setIsVerified(false);
  }

  return (
    <form className="space-y-3" action={dispatch}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        {/*<h1 className={`mb-3 text-2xl`}>Please sign up to continue.</h1>*/}
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                required
              />
              <BsFillPersonFill className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <MdAlternateEmail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <BsKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
                minLength={6}
              />
              <BsKey className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="my-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="goalsEndDate"
            >
              Goals End Date
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="goalsEndDate"
                type="date"
                name="goalsEndDate"
                placeholder="Enter goals end date"
              />
            </div>
          </div>
        </div>
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          ref={recaptchaRef}
          onChange={handleChange}
          onExpired={handleExpired}
        />

        <SignupButton disabled={!isVerified} />
        <div
          className="h-8 items-end space-x-1 mt-4"
          aria-live="polite"
          aria-atomic="true"
        >
          {type === "error" && (
            <>
              <p className="text-sm text-red-500 flex">
                <BsExclamationCircle className="h-5 w-5 text-red-500" /> &nbsp;
                {message}
              </p>
            </>
          )}
          {type === "success" && (
            <>
              <p className="text-sm text-green-500 flex">
                <BsExclamationCircle className="h-5 w-5 text-green-500" />{" "}
                &nbsp;
                {message}
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

function SignupButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <>
      <button
        type="submit"
        className={"btn btn-primary text-white mt-4"}
        disabled={pending || disabled}
        aria-disabled={pending}
      >
        Sign Up
        <LuUserCheck className="ml-auto h-5 w-5 text-gray-50" />
      </button>
    </>
  );
}

export default SignupForm;
