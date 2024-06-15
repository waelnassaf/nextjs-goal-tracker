"use client";

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateGoalsDate } from "@/server/actions";
import { calculateTimeDifference } from "@/lib/helpers";
import { toast } from "react-toastify";
import { TimeDifference } from "@/types";

const Hero = ({ endDate, id }: { endDate: Date; id: string }) => {
  const [timeLeft, setTimeLeft] = useState<TimeDifference>(
    calculateTimeDifference(new Date(endDate)),
  );
  const [editMode, setEditMode] = useState(false);
  const [startDate, setStartDate] = useState(new Date(endDate));
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(startDate);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          years: 0,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        setIsAlertVisible(true);
        clearInterval(timer);
      } else {
        setTimeLeft(calculateTimeDifference(end));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
      setIsAlertVisible(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    setEditMode(false);
    try {
      await updateGoalsDate(id, startDate);
      toast.success("Goals end date updated successfully");
    } catch (error) {
      toast.error("Failed to update goals end date, please try again.");
    }
  };

  return (
    <section>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            {isAlertVisible && (
              <div className="alert alert-error shadow-lg my-9">
                <div>
                  <span className="text-4xl">
                    Times Up! You should have achieved your goals by now!
                  </span>
                </div>
              </div>
            )}
            {editMode ? (
              <div className="flex gap-2 justify-center">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  dateFormat="Pp"
                  className="input input-bordered w-full max-w-xs"
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
