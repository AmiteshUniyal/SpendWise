import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppContext } from "../context/useAppContext";
import axiosInstance from "../api/axiosConfig";

interface TransactionFormData {
  _id?: string
  title: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
}

interface AddTransactionProps {
  isEdit: boolean;
  transaction: TransactionFormData | null;
}

const AddTransactionModal: React.FC<AddTransactionProps> = ({ isEdit, transaction }) => {
  const { setIsOpen, setEditModalOpen } = useAppContext();

  const [formData, setFormData] = useState<TransactionFormData>({
    title: "",
    amount: 0,
    date: "",
    category: "",
    type: "expense",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditModalOpen(false);
    setFormData({
      title: "",
      amount: 0,
      date: "",
      category: "",
      type: "expense",
    });
  };

  useEffect(() => {
    if (isEdit && transaction) {
      setFormData({
        title: transaction.title,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        type: transaction.type,
      });
    }
  }, [isEdit, transaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEdit && transaction?._id) {
        const res = await axiosInstance.put(`/transaction/update/${transaction._id}`, formData, {
          withCredentials: true,
        });
        console.log("Transaction edited successfully", res.data);
      } 
      else {
        const res = await axiosInstance.post("/transaction/create", formData, {
          withCredentials: true,
        });
        console.log("Transaction created successfully", res.data);
      }

      closeModal();
    } 
    catch (error: any) {
      console.error(
        `${isEdit ? "Error editing" : "Error creating"} transaction:`,
        error.response?.data || error.message
      );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModal}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="relative z-50 w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 dark:text-gray-100"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-500 hover:text-black dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="e.g. Freelance Work"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="e.g. 1200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
          >
            {isEdit ? "Update Transaction" : "Save Transaction"}
          </button>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddTransactionModal;
