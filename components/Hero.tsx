"use client";

// Hero.tsx
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateGoalsDate } from "@/server/actions";
import { calculateTimeDifference } from "@/lib/helpers";
import { toast } from "react-toastify";
import { User } from "@/types";

const Hero = ({ user }: { user: User }) => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeDifference(new Date(user.goalsEndDate)),
  );
  const [editMode, setEditMode] = useState(false);
  const [startDate, setStartDate] = useState(new Date(user.goalsEndDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeDifference(new Date(startDate)));
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [startDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    setEditMode(false);
    try {
      await updateGoalsDate(user._id, startDate);
      toast.success("Goals end date updated successfully");
      console.log("Goals end date updated successfully");
    } catch (error) {
      console.error("Failed to update goals end date:", error);
      toast.error("Failed to update goals end date: " + error.message);
    }
  };

  return (
    <section>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            {editMode ? (
              <div>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  dateFormat="Pp"
                />
                <button className="btn btn-primary" onClick={handleSaveClick}>
                  Save Date
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-5xl font-bold">
                  End Date: {new Date(startDate).toLocaleDateString()}
                </h1>
                <p className="text-4xl py-6" suppressHydrationWarning>
                  {`${timeLeft.years}Y : ${timeLeft.months}M : ${timeLeft.days}D : ${timeLeft.hours}H : ${timeLeft.minutes}M : ${timeLeft.seconds}S`}
                </p>
                <button className="btn btn-primary" onClick={handleEditClick}>
                  Edit Date
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
