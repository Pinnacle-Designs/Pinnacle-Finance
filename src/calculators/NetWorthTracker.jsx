import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput } from '../hooks/useInput';
import { formatCurrency } from '../utils/format';

const COLORS = ['#1B4FD8', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

export default function NetWorthTracker() {
  const checking = useCurrencyInput('5,000');
  const savings = useCurrencyInput('15,000');
  const investments = useCurrencyInput('30,000');
  const retirement = useCurrencyInput('80,000');
  const home = useCurrencyInput('350,000');
  const car = useCurrencyInput('20,000');
  const otherAssets = useCurrencyInput('5,000');
  const mortgage = useCurrencyInput('280,000');
  const carLoan = useCurrencyInput('12,000');
  const studentLoans = useCurrencyInput('25,000');
  const creditCard = useCurrencyInput('3,000');
  const otherDebt = useCurrencyInput('0');

  const results = useMemo(() => {
    const assets = checking.numeric + savings.numeric + investments.numeric + retirement.numeric + home.numeric + car.numeric + otherAssets.numeric;
    const liabilities = mortgage.numeric + carLoan.numeric + studentLoans.numeric + creditCard.numeric + otherDebt.numeric;
    const netWorth = assets - liabilities;

    const chartData = [
      { name: 'Checking', value: checking.numeric },
      { name: 'Savings', value: savings.numeric },
      { name: 'Investments', value: investments.numeric },
      { name: 'Retirement', value: retirement.numeric },
      { name: 'Home', value: home.numeric },
      { name: 'Car', value: car.numeric },
      { name: 'Other Assets', value: otherAssets.numeric },
      { name: 'Mortgage', value: mortgage.numeric },
      { name: 'Car Loan', value: carLoan.numeric },
      { name: 'Student Loans', value: studentLoans.numeric },
      { name: 'Credit Cards', value: creditCard.numeric },
      { name: 'Other Debt', value: otherDebt.numeric },
    ].filter((d) => d.value > 0);

    return { assets, liabilities, netWorth, chartData };
  }, [checking.numeric, savings.numeric, investments.numeric, retirement.numeric, home.numeric, car.numeric, otherAssets.numeric, mortgage.numeric, carLoan.numeric, studentLoans.numeric, creditCard.numeric, otherDebt.numeric]);

  return (
    <CalculatorPage
      title="Net Worth Calculator"
      description="Calculate your net worth by adding up your assets and liabilities. Free net worth tracker with visual breakdown."
      intro="Your net worth is the single most important number in personal finance — it's everything you own minus everything you owe. Track your assets and liabilities to see where you stand financially."
      howItWorks="Net worth equals total assets minus total liabilities. Assets include cash, investments, retirement accounts, home equity, and property. Liabilities include mortgages, car loans, student loans, credit card debt, and other obligations."
      currentPath="/net-worth-calculator"
      faq={[
        { question: 'What is a good net worth by age?', answer: 'A common benchmark is your age × annual income ÷ 10. At 30, aim for 1× your salary saved. By 40, 3× your salary. By 50, 6×. By 60, 8×. These are guidelines — your situation may vary based on location and lifestyle.' },
        { question: 'How to increase net worth?', answer: 'Increase income, reduce expenses, pay down high-interest debt, invest consistently, and avoid lifestyle inflation. Building net worth is a marathon — focus on increasing the gap between what you earn and what you spend.' },
        { question: 'Does net worth include home equity?', answer: 'Yes. Your home value is counted as an asset, and your mortgage balance is a liability. Net home equity (home value minus mortgage) contributes to your net worth. Some planners exclude home equity for retirement planning purposes.' },
        { question: 'How often should I calculate net worth?', answer: 'Monthly or quarterly is ideal. Tracking net worth over time shows your financial progress and helps you stay motivated. Use the same methodology each time for accurate comparisons.' },
      ]}
      results={
        <>
          <ResultCard label="Total Assets" value={formatCurrency(results.assets)} variant="success" />
          <ResultCard label="Total Liabilities" value={formatCurrency(results.liabilities)} variant="danger" />
          <ResultCard label="Net Worth" value={formatCurrency(results.netWorth)} variant={results.netWorth >= 0 ? 'success' : 'danger'} highlight />
          <div className="col-span-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={results.chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {results.chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    >
      <div className="col-span-full">
        <h3 className="font-semibold text-slate-900 mb-3">Assets</h3>
      </div>
      <InputField label="Checking" id="checking" value={checking.display} onChange={checking.onChange} onBlur={checking.onBlur} onFocus={checking.onFocus} placeholder="5,000" />
      <InputField label="Savings" id="savings" value={savings.display} onChange={savings.onChange} onBlur={savings.onBlur} onFocus={savings.onFocus} placeholder="15,000" />
      <InputField label="Investments" id="investments" value={investments.display} onChange={investments.onChange} onBlur={investments.onBlur} onFocus={investments.onFocus} placeholder="30,000" />
      <InputField label="Retirement Accounts" id="retirement" value={retirement.display} onChange={retirement.onChange} onBlur={retirement.onBlur} onFocus={retirement.onFocus} placeholder="80,000" />
      <InputField label="Home Value" id="home" value={home.display} onChange={home.onChange} onBlur={home.onBlur} onFocus={home.onFocus} placeholder="350,000" />
      <InputField label="Car Value" id="car" value={car.display} onChange={car.onChange} onBlur={car.onBlur} onFocus={car.onFocus} placeholder="20,000" />
      <InputField label="Other Assets" id="otherAssets" value={otherAssets.display} onChange={otherAssets.onChange} onBlur={otherAssets.onBlur} onFocus={otherAssets.onFocus} placeholder="5,000" />
      <div className="col-span-full mt-4">
        <h3 className="font-semibold text-slate-900 mb-3">Liabilities</h3>
      </div>
      <InputField label="Mortgage Balance" id="mortgage" value={mortgage.display} onChange={mortgage.onChange} onBlur={mortgage.onBlur} onFocus={mortgage.onFocus} placeholder="280,000" />
      <InputField label="Car Loans" id="carLoan" value={carLoan.display} onChange={carLoan.onChange} onBlur={carLoan.onBlur} onFocus={carLoan.onFocus} placeholder="12,000" />
      <InputField label="Student Loans" id="studentLoans" value={studentLoans.display} onChange={studentLoans.onChange} onBlur={studentLoans.onBlur} onFocus={studentLoans.onFocus} placeholder="25,000" />
      <InputField label="Credit Card Debt" id="creditCard" value={creditCard.display} onChange={creditCard.onChange} onBlur={creditCard.onBlur} onFocus={creditCard.onFocus} placeholder="3,000" />
      <InputField label="Other Debt" id="otherDebt" value={otherDebt.display} onChange={otherDebt.onChange} onBlur={otherDebt.onBlur} onFocus={otherDebt.onFocus} placeholder="0" />
    </CalculatorPage>
  );
}
