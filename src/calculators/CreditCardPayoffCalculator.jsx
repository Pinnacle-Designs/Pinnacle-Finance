import { useMemo } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, formatDate, loanPayoffSchedule } from '../utils/format';

export default function CreditCardPayoffCalculator() {
  const balance = useCurrencyInput('8,000');
  const apr = useNumberInput('22.99');
  const payment = useCurrencyInput('250');

  const results = useMemo(() => {
    const main = loanPayoffSchedule(balance.numeric, apr.numeric, payment.numeric, 0);
    const minPayment = Math.max(25, balance.numeric * 0.02);
    const minimum = loanPayoffSchedule(balance.numeric, apr.numeric, minPayment, 0);
    const interestSaved = main.paysOff && minimum.paysOff ? minimum.totalInterest - main.totalInterest : 0;
    const monthsSaved = main.paysOff && minimum.paysOff ? minimum.months - main.months : 0;

    return { main, minimum, minPayment, interestSaved, monthsSaved };
  }, [balance.numeric, apr.numeric, payment.numeric]);

  return (
    <CalculatorPage
      title="Credit Card Payoff Calculator"
      description="See how long it will take to pay off your credit card debt. Compare your payment vs minimum payment."
      intro="Credit card debt can be expensive due to high APRs. Enter your balance, interest rate, and planned monthly payment to see your payoff timeline — and compare how much you save versus paying only the minimum."
      howItWorks="Credit card interest is calculated daily on your average daily balance and compounded monthly. Each payment covers interest first, then reduces principal. Paying more than the minimum dramatically reduces both payoff time and total interest paid."
      currentPath="/credit-card-payoff-calculator"
      faq={[
        { question: 'How is credit card interest calculated?', answer: 'Credit card companies use your average daily balance multiplied by the daily periodic rate (APR ÷ 365). Interest accrues daily and is added to your balance monthly. This is why carrying a balance is so expensive.' },
        { question: 'What is APR vs interest rate?', answer: 'For credit cards, APR and interest rate are typically the same since there is no compounding period separate from the rate. APR includes fees in some loan types, but for credit cards they are usually equivalent.' },
        { question: 'How to pay off $10k in credit card debt?', answer: 'At 23% APR, paying $300/month on $10,000 takes about 4.5 years and costs $6,000+ in interest. Increase payments to $500/month to pay off in under 2 years and save over $4,000. Consider a balance transfer to a 0% card.' },
        { question: 'Should I pay off credit cards or save first?', answer: 'Generally, pay off high-interest credit card debt before building savings beyond a small emergency fund. Credit card interest at 20%+ far exceeds typical savings account returns of 4-5%.' },
      ]}
      results={
        <>
          <ResultCard
            label="Months to Pay Off"
            value={results.main.paysOff ? `${results.main.months} months` : 'Payment too low'}
            variant={results.main.paysOff ? 'default' : 'danger'}
            highlight
          />
          <ResultCard label="Total Interest Paid" value={formatCurrency(results.main.totalInterest)} />
          <ResultCard
            label="Payoff Date"
            value={results.main.paysOff ? formatDate(results.main.payoffDate) : '—'}
          />
          <ResultCard label="Minimum Payment (2%)" value={formatCurrency(results.minPayment)} />
          <ResultCard
            label="Months at Minimum"
            value={results.minimum.paysOff ? `${results.minimum.months} months` : 'Never'}
            variant="danger"
          />
          <ResultCard label="Interest Saved vs Minimum" value={formatCurrency(results.interestSaved)} variant="success" />
          <ResultCard label="Months Saved" value={`${results.monthsSaved} months`} variant="success" />
        </>
      }
    >
      <InputField label="Balance" id="balance" value={balance.display} onChange={balance.onChange} onBlur={balance.onBlur} onFocus={balance.onFocus} placeholder="8,000" />
      <InputField label="APR" id="apr" value={apr.value} onChange={apr.onChange} placeholder="22.99" suffix="%" />
      <InputField label="Monthly Payment" id="payment" value={payment.display} onChange={payment.onChange} onBlur={payment.onBlur} onFocus={payment.onFocus} placeholder="250" />
    </CalculatorPage>
  );
}
