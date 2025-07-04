import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAppContext } from "../../context/useAppContext";
import { Plus } from "lucide-react";
import Loader from "../../components/Loader";
import AddTransactionModal from "../../components/AddTransaction";

const cn = (...inputs: (string | undefined | false | null)[]) =>
  inputs.filter(Boolean).join(" ");

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-2", className)} {...props} />
);

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-xl md:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white",
      className
    )}
    {...props}
  />
);

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("pt-2", className)} {...props} />
);


const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-64">{children}</CardContent>
  </Card>
);

const FlashCard = ({ label, value }: { label: string; value: string }) => (
  <Card className="flex flex-col gap-2 overflow-hidden">
    <p className="text-sm md:text-xl text-gray-600 dark:text-gray-300">{label}</p>
    <p className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
  </Card>
);

const HomePage: React.FC = () => {
  const {
    authUser,
    setIsOpen,
    isOpen,
    transactions,
    fetchTransaction,
    editModalOpen,
    editingTransaction,
    darkMode,
  } = useAppContext();

  const [loading, setLoading] = useState<boolean>(false);
  
  const COLORS = !darkMode ? [
    "#edc948",
    "#59a14f",
    "#f28e2b",
    "#4e79a7",
    "#e15759",
    "#76b7b2",
  ] : ["#f9e066", "#7dd87d", "#ffac4b", "#6ea8e3", "#ff7b7b", "#9de0db"];


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTransaction();
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const Categories = new Map<string, number>();
  transactions.forEach((transaction) => {
    const category = transaction.category;
    const currentCount = Categories.get(category) || 0;
    Categories.set(category, currentCount + transaction.amount);
  });

  const pieData = Array.from(Categories, ([name, value]) => ({ name, value }));

  const barData = transactions
    .slice(0, 5)
    .reverse()
    .map((transaction, index) => ({
      name: index + 1,
      amount: transaction.amount,
    }));

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalMonthlyExpenses = transactions
    .filter((transaction) => {
      const date = new Date(transaction.date);
      return (
        transaction.type === "expense" &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const goalStartDate = authUser?.goalSetDate ? new Date(authUser.goalSetDate) : null;
  let monthsSinceGoalSet = 0;
  if (goalStartDate) {
    const now = new Date();
    monthsSinceGoalSet =
      (now.getFullYear() - goalStartDate.getFullYear()) * 12 +
      (now.getMonth() - goalStartDate.getMonth()) +
      1;
  }

  const filteredTransactions = goalStartDate
    ? transactions.filter((transaction) => new Date(transaction.date) >= goalStartDate)
    : [];

  const incomeFromTransactions = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const expenseFromTransactions = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const estimatedSalary = (authUser?.income || 0) * monthsSinceGoalSet;

  const totalMoneySaved =
    estimatedSalary + incomeFromTransactions - expenseFromTransactions;

  if (loading) return <Loader />;

  return (
    <>
      {isOpen && (
        <AddTransactionModal
          isEdit={editModalOpen}
          transaction={editingTransaction}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className={cn(darkMode ? "dark" : "")}
      >
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FlashCard label="Monthly Income" value={`${authUser?.income}`} />
          <FlashCard label="Monthly Expenses" value={`${totalMonthlyExpenses}`} />
          <FlashCard
            label={`Goal: ${authUser?.goal}`}
            value={`${totalMoneySaved} / ${authUser?.goalAmount}`}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="w-full">
            <ChartCard title="Spending Division">
              <div className="flex items-center justify-center h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={40} iconType="circle" />
                    <Tooltip
                      contentStyle={{
                        fontSize: 14,
                        backgroundColor: "white",
                        color:"black",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Bar Chart */}
          <div className="w-full">
            <ChartCard title="Your last 5 days spending">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 20, bottom: 20, left: -30 }}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 18, fill: darkMode ? "#ccc" : "#000" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: darkMode ? "#ccc" : "#000" }}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        fontSize: 18,
                        backgroundColor: darkMode ? "#1f2937" : "#fff",
                        color: darkMode ? "#f9fafb" : "#000",
                      }}
                    />
                    <Bar dataKey="amount" fill="#4F46E5" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        <div className="mt-6">
          <Card>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Recent Transactions
              </h2>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                          )}
                        >
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 overflow-hidden">
                        {transaction.title}
                      </td>
                      <td
                        className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm font-medium",
                          transaction.type === "income"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {Math.abs(transaction.amount).toFixed(2)}
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
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;
