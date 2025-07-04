import React, { useEffect, useState } from 'react';
import {
  FiUser, FiMail, FiCalendar,
} from 'react-icons/fi';
import { useAppContext } from '../../context/useAppContext';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AddTransactionModal from '../../components/AddTransaction';
import axiosInstance from '../../api/axiosConfig';
import Loader from '../../components/Loader';

const ProfilePage: React.FC = () => {
  const {
    authUser,
    setIsOpen,
    isOpen,
    transactions,
    fetchTransaction,
    setTransactions,
    editModalOpen,
    setEditModalOpen,
    editingTransaction,
    setEditingTransaction,
  } = useAppContext();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTransaction();
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (transactionId: string) => {
    try {
      const res = await axiosInstance.delete(`/transaction/delete/${transactionId}`, {
        withCredentials: true,
      });
      console.log('Transaction deleted:', res.data);
      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
    } catch (error: any) {
      console.error('Error deleting transaction:', error.response?.data || error.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      {(isOpen || editModalOpen) && (
        <AddTransactionModal
          isEdit={editModalOpen}
          transaction={editingTransaction}
        />
      )}

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 mb-8 text-gray-900 dark:text-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-500 rounded-full p-4">
              <FiUser className="text-white text-2xl" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white overflow-hidden">{authUser?.username}</h1>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <FiMail className="mr-2" />
                <span className="break-all overflow-hidden">{authUser?.email}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                <FiCalendar className="mr-2" />
                <span>Joined {new Date(authUser?.createdAt || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 text-gray-900 dark:text-gray-100">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Transactions</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 overflow-hidden">
                    {transaction.title}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-300'
                        : 'text-red-600 dark:text-red-300'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTransaction(transaction);
                        setEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-600 hover:underline dark:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
