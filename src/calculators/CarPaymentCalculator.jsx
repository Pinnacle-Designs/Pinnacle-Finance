import { useMemo } from 'react';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, monthlyPayment } from '../utils/format';

export default function CarPaymentCalculator() {
  const price = useCurrencyInput('35,000');
  const down = useCurrencyInput('5,000');
  const tradeIn = useCurrencyInput('3,000');
  const taxRate = useNumberInput('7');
  const term = useNumberInput('60');
  const rate = useNumberInput('6.9');

  const results = useMemo(() => {
    const taxableAmount = Math.max(0, price.numeric - tradeIn.numeric);
    const salesTax = taxableAmount * (taxRate.numeric / 100);
    const loanAmount = taxableAmount + salesTax - down.numeric;
    const payment = monthlyPayment(loanAmount, rate.numeric, term.numeric);
    const totalPaid = payment * term.numeric;
    const totalInterest = totalPaid - loanAmount;
    const totalCost = price.numeric + totalInterest + salesTax - tradeIn.numeric;

    return { loanAmount, payment, totalInterest, totalCost };
  }, [price.numeric, down.numeric, tradeIn.numeric, taxRate.numeric, term.numeric, rate.numeric]);

  return (
    <CalculatorPage
      title="Car Payment Calculator"
      description="Calculate your monthly car payment and total loan cost. Free auto loan calculator with taxes and trade-in."
      intro="Buying a car? Calculate your estimated monthly payment based on vehicle price, down payment, trade-in value, sales tax, loan term, and interest rate. See the full cost of your auto loan before you visit the dealership."
      howItWorks="The loan amount equals the vehicle price minus trade-in and down payment, plus sales tax. Your monthly payment uses standard amortization based on the loan amount, APR, and term in months."
      currentPath="/car-payment-calculator"
      faq={[
        { question: "What's a good car loan rate?", answer: 'As of 2025, good auto loan rates range from 5% to 8% for new cars and 6% to 10% for used cars, depending on credit score. Credit scores above 750 typically qualify for the best rates under 6%.' },
        { question: 'How much car can I afford?', answer: 'Financial experts recommend spending no more than 10-15% of your take-home pay on a car payment, and keeping total vehicle costs (payment, insurance, gas, maintenance) under 20% of take-home pay.' },
        { question: 'Is a 72-month loan a bad idea?', answer: 'Longer loan terms mean lower monthly payments but significantly more interest. A 72-month loan on $30,000 at 7% costs about $4,500 more in interest than a 48-month loan. You may also owe more than the car is worth for years.' },
        { question: 'Should I finance through the dealer or my bank?', answer: 'Compare both. Credit unions and banks often offer better rates than dealer financing. Get pre-approved from your bank before visiting the dealership so you have a benchmark to negotiate against.' },
      ]}
      results={
        <>
          <ResultCard label="Monthly Payment" value={formatCurrency(results.payment)} highlight />
          <ResultCard label="Total Loan Amount" value={formatCurrency(results.loanAmount)} />
          <ResultCard label="Total Interest Paid" value={formatCurrency(results.totalInterest)} />
          <ResultCard label="Total Cost of Vehicle" value={formatCurrency(results.totalCost)} />
        </>
      }
    >
      <InputField label="Vehicle Price" id="price" value={price.display} onChange={price.onChange} onBlur={price.onBlur} onFocus={price.onFocus} placeholder="35,000" />
      <InputField label="Down Payment" id="down" value={down.display} onChange={down.onChange} onBlur={down.onBlur} onFocus={down.onFocus} placeholder="5,000" />
      <InputField label="Trade-In Value" id="tradeIn" value={tradeIn.display} onChange={tradeIn.onChange} onBlur={tradeIn.onBlur} onFocus={tradeIn.onFocus} placeholder="3,000" />
      <InputField label="Sales Tax Rate" id="taxRate" value={taxRate.value} onChange={taxRate.onChange} placeholder="7" suffix="%" />
      <InputField label="Loan Term" id="term" value={term.value} onChange={term.onChange} options={[{ value: '24', label: '24 months' }, { value: '36', label: '36 months' }, { value: '48', label: '48 months' }, { value: '60', label: '60 months' }, { value: '72', label: '72 months' }, { value: '84', label: '84 months' }]} />
      <InputField label="Interest Rate (APR)" id="rate" value={rate.value} onChange={rate.onChange} placeholder="6.9" suffix="%" />
    </CalculatorPage>
  );
}
