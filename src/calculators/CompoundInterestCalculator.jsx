import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, compoundGrowth } from '../utils/format';
import { CHART_COLORS, chartTooltipStyle } from '../utils/chartTheme';

export default function CompoundInterestCalculator() {
  const principal = useCurrencyInput('10,000');
  const rate = useNumberInput('7');
  const [frequency, setFrequency] = useState('monthly');
  const years = useNumberInput('20');
  const contribution = useCurrencyInput('200');

  const results = useMemo(
    () =>
      compoundGrowth(
        principal.numeric,
        rate.numeric,
        years.numeric,
        frequency,
        contribution.numeric
      ),
    [principal.numeric, rate.numeric, years.numeric, frequency, contribution.numeric]
  );

  return (
    <CalculatorPage
      title="Compound Interest Calculator"
      description="See how your money grows over time with compound interest. Calculate returns with monthly contributions."
      intro="Compound interest is interest earned on both your principal and previously earned interest. Use this calculator to project how your savings or investments grow over time with regular contributions."
      howItWorks="Compound interest is calculated using the formula A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time in years. Monthly contributions are added and compounded at the selected frequency."
      currentPath="/compound-interest-calculator"
      faq={[
        { question: 'What is compound interest?', answer: 'Compound interest is interest calculated on the initial principal plus all accumulated interest from previous periods. It causes your money to grow exponentially over time — Einstein reportedly called it the eighth wonder of the world.' },
        { question: 'Daily vs monthly compounding — does it matter?', answer: 'Daily compounding earns slightly more than monthly because interest is calculated and added more frequently. The difference is usually small — on $10,000 at 7% over 20 years, daily compounding earns about $200 more than monthly.' },
        { question: 'What is the Rule of 72?', answer: 'The Rule of 72 estimates how long it takes to double your money: divide 72 by your annual interest rate. At 7% return, your money doubles in roughly 72 ÷ 7 ≈ 10.3 years.' },
        { question: 'How much should I invest monthly?', answer: 'A common guideline is to invest 15–20% of your gross income for retirement. For other goals, determine your target amount and timeline, then use our Savings Goal Calculator to find the required monthly contribution.' },
      ]}
      results={
        <>
          <ResultCard label="Final Balance" value={formatCurrency(results.finalBalance)} highlight />
          <ResultCard label="Total Contributions" value={formatCurrency(results.totalContributions)} />
          <ResultCard label="Total Interest Earned" value={formatCurrency(results.totalInterest)} variant="success" />
          <div className="col-span-full mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={chartTooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="balance" name="Balance" stroke={CHART_COLORS.primary} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    >
      <InputField label="Principal" id="principal" value={principal.display} onChange={principal.onChange} onBlur={principal.onBlur} onFocus={principal.onFocus} placeholder="10,000" prefix="$" />
      <InputField label="Annual Interest Rate" id="rate" value={rate.value} onChange={rate.onChange} placeholder="7" suffix="%" />
      <InputField label="Compound Frequency" id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} options={[{ value: 'daily', label: 'Daily' }, { value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly' }, { value: 'annually', label: 'Annually' }]} />
      <InputField label="Time Period" id="years" value={years.value} onChange={years.onChange} placeholder="20" suffix="years" />
      <InputField label="Monthly Contribution" id="contribution" value={contribution.display} onChange={contribution.onChange} onBlur={contribution.onBlur} onFocus={contribution.onFocus} placeholder="200" prefix="$" tooltip="Optional regular monthly deposit" />
    </CalculatorPage>
  );
}
