import { useMemo } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, formatDate, loanPayoffSchedule } from '../utils/format';

export default function LoanPayoffCalculator() {
  const balance = useCurrencyInput('25,000');
  const rate = useNumberInput('7.5');
  const payment = useCurrencyInput('500');
  const extra = useCurrencyInput('100');

  const results = useMemo(() => {
    const base = loanPayoffSchedule(balance.numeric, rate.numeric, payment.numeric, 0);
    const withExtra = loanPayoffSchedule(balance.numeric, rate.numeric, payment.numeric, extra.numeric);
    const interestSaved = base.paysOff && withExtra.paysOff ? base.totalInterest - withExtra.totalInterest : 0;
    const monthsSaved = base.paysOff && withExtra.paysOff ? base.months - withExtra.months : 0;
    return { base, withExtra, interestSaved, monthsSaved };
  }, [balance.numeric, rate.numeric, payment.numeric, extra.numeric]);

  return (
    <CalculatorPage
      title="Loan Payoff Calculator"
      description="Find out when you'll pay off any loan and how much interest you'll pay. See the impact of extra monthly payments."
      intro="Enter your current loan balance, interest rate, and monthly payment to see your payoff date and total interest. Add an optional extra payment to see how much time and money you can save."
      howItWorks="Each month, your payment covers interest first, then principal. Extra payments go directly toward principal, reducing the balance faster and cutting total interest. This calculator simulates month-by-month payments until the balance reaches zero."
      currentPath="/loan-payoff-calculator"
      faq={[
        { question: 'How to pay off a loan faster?', answer: 'Make extra payments toward principal, round up your monthly payment, or make biweekly payments instead of monthly. Even an extra $50–100 per month can shave months or years off your loan and save significant interest.' },
        { question: 'Does extra payment go to principal?', answer: 'Yes, when you specify an extra payment on your loan, it goes directly toward reducing the principal balance. This lowers the amount of interest charged in future months, accelerating your payoff.' },
        { question: 'What is the avalanche vs snowball method?', answer: 'The avalanche method pays off highest-interest debt first, saving the most money. The snowball method pays off smallest balances first for psychological wins. Both work — avalanche is mathematically optimal, snowball builds momentum.' },
        { question: 'Can I pay off my loan early without penalty?', answer: 'Most personal and auto loans allow early payoff without penalty, but some mortgages and loans include prepayment penalties. Check your loan agreement before making extra payments.' },
      ]}
      results={
        <>
          <ResultCard
            label="Payoff Date (standard)"
            value={results.base.paysOff ? formatDate(results.base.payoffDate) : 'Payment too low'}
            variant={results.base.paysOff ? 'default' : 'danger'}
          />
          <ResultCard
            label="Payoff Date (with extra)"
            value={results.withExtra.paysOff ? formatDate(results.withExtra.payoffDate) : 'Payment too low'}
            variant={results.withExtra.paysOff ? 'success' : 'danger'}
          />
          <ResultCard label="Interest Saved" value={formatCurrency(results.interestSaved)} variant="success" />
          <ResultCard label="Total Interest Paid" value={formatCurrency(results.base.totalInterest)} />
          <ResultCard
            label="Months Saved"
            value={results.monthsSaved > 0 ? `${results.monthsSaved} months` : '—'}
            variant="success"
          />
        </>
      }
    >
      <InputField label="Current Balance" id="balance" value={balance.display} onChange={balance.onChange} onBlur={balance.onBlur} onFocus={balance.onFocus} placeholder="25,000" prefix="$" />
      <InputField label="Interest Rate" id="rate" value={rate.value} onChange={rate.onChange} placeholder="7.5" suffix="%" />
      <InputField label="Monthly Payment" id="payment" value={payment.display} onChange={payment.onChange} onBlur={payment.onBlur} onFocus={payment.onFocus} placeholder="500" prefix="$" />
      <InputField label="Extra Monthly Payment" id="extra" value={extra.display} onChange={extra.onChange} onBlur={extra.onBlur} onFocus={extra.onFocus} placeholder="100" prefix="$" tooltip="Optional additional payment toward principal" />
    </CalculatorPage>
  );
}
