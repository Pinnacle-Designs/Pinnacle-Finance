import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency } from '../utils/format';

export default function RetirementSavingsCalculator() {
  const currentAge = useNumberInput('35');
  const retireAge = useNumberInput('65');
  const savings = useCurrencyInput('50,000');
  const contribution = useCurrencyInput('500');
  const returnRate = useNumberInput('7');
  const inflation = useNumberInput('3');
  const desiredIncome = useCurrencyInput('5,000');
  const socialSecurity = useCurrencyInput('2,000');

  const results = useMemo(() => {
    const years = Math.max(0, retireAge.numeric - currentAge.numeric);
    const r = returnRate.numeric / 100;
    const infl = inflation.numeric / 100;
    let balance = savings.numeric;
    for (let i = 0; i < years * 12; i++) {
      balance = balance * (1 + r / 12) + contribution.numeric;
    }
    const projectedSavings = balance;
    const monthlyNeedToday = Math.max(0, desiredIncome.numeric - socialSecurity.numeric);
    const monthlyNeedAtRetirement = monthlyNeedToday * Math.pow(1 + infl, years);
    const annualNeedAtRetirement = monthlyNeedAtRetirement * 12;
    const amountNeeded = annualNeedAtRetirement / 0.04;
    const gap = amountNeeded - projectedSavings;
    const monthlyGap = years > 0 ? Math.abs(gap) / (years * 12) : 0;
    const yearsMoneyLasts = monthlyNeedAtRetirement > 0 ? (projectedSavings / annualNeedAtRetirement) * 25 : 0;

    const chartData = [
      { name: 'Your Path', amount: Math.round(projectedSavings) },
      { name: 'Needed', amount: Math.round(amountNeeded) },
    ];

    return { projectedSavings, amountNeeded, gap, monthlyGap, yearsMoneyLasts, chartData, onTrack: gap <= 0 };
  }, [currentAge.numeric, retireAge.numeric, savings.numeric, contribution.numeric, returnRate.numeric, inflation.numeric, desiredIncome.numeric, socialSecurity.numeric]);

  return (
    <CalculatorPage
      title="Retirement Savings Calculator"
      description="Calculate how much you need to retire and if you're on track. Free retirement planning calculator with 4% rule."
      intro="Are you saving enough for retirement? Enter your current age, savings, and goals to see your projected nest egg at retirement and whether you're on track using the widely-used 4% withdrawal rule."
      howItWorks="We project your savings growth with monthly contributions and compound returns until retirement. The amount needed is calculated using the 4% rule: you need 25× your annual retirement spending (after Social Security) to sustain withdrawals indefinitely."
      currentPath="/retirement-calculator"
      faq={[
        { question: 'How much do I need to retire?', answer: 'A common rule of thumb is 25 times your annual expenses (the 4% rule). If you need $60,000 per year in retirement, you need roughly $1.5 million saved. This varies based on lifestyle, health care costs, and Social Security benefits.' },
        { question: 'What is the 4% rule?', answer: 'The 4% rule suggests you can withdraw 4% of your retirement portfolio in the first year, adjusting for inflation each year, with a high probability of your money lasting 30 years. It is based on historical market data and Trinity Study research.' },
        { question: 'Should I max my 401k?', answer: 'If your employer offers a match, always contribute enough to get the full match — it is free money. Beyond that, maxing your 401k ($23,500 in 2025) is one of the best tax-advantaged ways to save for retirement.' },
        { question: 'When should I start saving for retirement?', answer: 'As early as possible. Thanks to compound interest, saving $200/month from age 25 to 65 at 7% returns over $500,000. Starting at 35, you would need to save roughly $400/month for the same result.' },
      ]}
      results={
        <>
          <ResultCard label="Projected Savings at Retirement" value={formatCurrency(results.projectedSavings)} />
          <ResultCard label="Amount Needed (4% rule)" value={formatCurrency(results.amountNeeded)} />
          <ResultCard
            label={results.onTrack ? 'On Track — Surplus' : 'Monthly Savings Needed'}
            value={formatCurrency(results.monthlyGap)}
            variant={results.onTrack ? 'success' : 'warning'}
            highlight
          />
          <ResultCard label="Years Your Money Will Last" value={`${results.yearsMoneyLasts.toFixed(1)} years`} />
          <div className="col-span-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Bar dataKey="amount" name="Amount" fill="#1B4FD8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    >
      <InputField label="Current Age" id="currentAge" value={currentAge.value} onChange={currentAge.onChange} placeholder="35" />
      <InputField label="Retirement Age" id="retireAge" value={retireAge.value} onChange={retireAge.onChange} placeholder="65" />
      <InputField label="Current Savings" id="savings" value={savings.display} onChange={savings.onChange} onBlur={savings.onBlur} onFocus={savings.onFocus} placeholder="50,000" />
      <InputField label="Monthly Contribution" id="contribution" value={contribution.display} onChange={contribution.onChange} onBlur={contribution.onBlur} onFocus={contribution.onFocus} placeholder="500" />
      <InputField label="Expected Annual Return" id="returnRate" value={returnRate.value} onChange={returnRate.onChange} placeholder="7" suffix="%" />
      <InputField label="Expected Annual Inflation" id="inflation" value={inflation.value} onChange={inflation.onChange} placeholder="3" suffix="%" />
      <InputField label="Desired Monthly Income in Retirement" id="desiredIncome" value={desiredIncome.display} onChange={desiredIncome.onChange} onBlur={desiredIncome.onBlur} onFocus={desiredIncome.onFocus} placeholder="5,000" />
      <InputField label="Expected Social Security" id="socialSecurity" value={socialSecurity.display} onChange={socialSecurity.onChange} onBlur={socialSecurity.onBlur} onFocus={socialSecurity.onFocus} placeholder="2,000" suffix="/mo" />
    </CalculatorPage>
  );
}
