import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api/axiosConfig";

interface GoalFormData {
  income: number;
  currency: string;
  goal: string;
  goalAmount: number;
  goalSetDate: string;
}

const GoalModal: React.FC = () => {

  const [formData, setFormData] = useState<GoalFormData>({
    income: 0,
    currency: "INR",
    goal: "",
    goalAmount: 0,
    goalSetDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "income" || name === "goalAmount" ? parseFloat(value) : value,
    }));
  };


  const handleSubmit = async () => {
    // e.preventDefault();
    
    const updatedFormData = {
      ...formData,
      goalSetDate: new Date().toISOString(),
    };

    try {
      const res = await axiosInstance.post("/auth/save", updatedFormData, {
        withCredentials: true,
      });
      console.log("Goal saved:", res.data);
    } 
    catch (error: any) {
      console.error("Error saving goal:", error.response?.data || error.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="relative z-50 w-[90%] max-w-md rounded-2xl bg-white dark:bg-gray-900 dark:text-gray-100 p-6 shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">Set Your Saving Goal</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Income
              </label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="e.g. 50000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                required
              >
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Savings Goal
              </label>
              <input
                type="text"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="e.g. Emergency Fund"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Goal Amount
              </label>
              <input
                type="number"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="e.g. 100000"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            Save Goal
          </button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
}

export default GoalModal;
