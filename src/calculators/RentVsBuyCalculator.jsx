import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import CalculatorPage from '../components/CalculatorPage';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { useCurrencyInput, useNumberInput } from '../hooks/useInput';
import { formatCurrency, monthlyPayment } from '../utils/format';

export default function RentVsBuyCalculator() {
  const homePrice = useCurrencyInput('400,000');
  const downPct = useNumberInput('20');
  const mortgageRate = useNumberInput('6.5');
  const taxRate = useNumberInput('1.2');
  const hoa = useCurrencyInput('0');
  const homeInsurance = useCurrencyInput('150');
  const appreciation = useNumberInput('3');
  const rent = useCurrencyInput('2,000');
  const rentIncrease = useNumberInput('3');
  const compareYears = useNumberInput('10');
  const investReturn = useNumberInput('7');

  const results = useMemo(() => {
    const price = homePrice.numeric;
    const down = price * (downPct.numeric / 100);
    const loan = price - down;
    const monthlyMortgage = monthlyPayment(loan, mortgageRate.numeric, 360);
    const monthlyTax = (price * taxRate.numeric / 100) / 12;
    const monthlyBuy = monthlyMortgage + monthlyTax + homeInsurance.numeric + hoa.numeric;

    const years = compareYears.numeric;
    const chartData = [];
    let totalBuyCost = down;
    let totalRentCost = 0;
    let homeValue = price;
    let rentPayment = rent.numeric;
    let renterPortfolio = down;
    let loanBalance = loan;
    const monthlyRate = mortgageRate.numeric / 100 / 12;
    let breakEvenYear = null;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        totalBuyCost += monthlyBuy;
        totalRentCost += rentPayment;

        const interest = loanBalance * monthlyRate;
        const principal = monthlyMortgage - interest;
        loanBalance = Math.max(0, loanBalance - principal);

        renterPortfolio = renterPortfolio * (1 + investReturn.numeric / 100 / 12);
      }
      homeValue *= 1 + appreciation.numeric / 100;
      rentPayment *= 1 + rentIncrease.numeric / 100;

      const equity = homeValue - loanBalance;
      const buyNet = equity - totalBuyCost;
      const rentNet = renterPortfolio - totalRentCost;

      chartData.push({
        year: y,
        buying: Math.round(totalBuyCost),
        renting: Math.round(totalRentCost),
        buyNet: Math.round(buyNet),
        rentNet: Math.round(rentNet),
      });

      if (!breakEvenYear && buyNet > rentNet) breakEvenYear = y;
    }

    const final = chartData[chartData.length - 1];
    const verdict = breakEvenYear
      ? `Buying wins after ${breakEvenYear} years`
      : `Renting is better if you stay less than ${years} years`;

    return { chartData, breakEvenYear, verdict, final, years };
  }, [homePrice.numeric, downPct.numeric, mortgageRate.numeric, taxRate.numeric, hoa.numeric, homeInsurance.numeric, appreciation.numeric, rent.numeric, rentIncrease.numeric, compareYears.numeric, investReturn.numeric]);

  return (
    <CalculatorPage
      title="Rent vs. Buy Calculator"
      description="Should you rent or buy a home? Compare the true costs of renting versus buying over time."
      intro="The rent vs. buy decision depends on how long you plan to stay, local market conditions, and opportunity cost of your down payment. This calculator compares cumulative costs and net position over your chosen time horizon."
      howItWorks="We model monthly buying costs (mortgage, taxes, insurance, HOA) versus rent payments that increase annually. For renting, the down payment difference is invested at your specified return rate. Home appreciation builds equity for buyers."
      currentPath="/rent-vs-buy-calculator"
      faq={[
        { question: 'Is it better to rent or buy?', answer: 'It depends on your timeline, local market, and financial situation. Buying typically makes sense if you plan to stay 5+ years. Renting offers flexibility, lower upfront costs, and avoids maintenance expenses.' },
        { question: 'How long to stay to make buying worth it?', answer: 'The break-even point is typically 3-7 years depending on home prices, rent costs, and transaction costs (closing costs, realtor fees). This calculator shows your specific break-even based on your inputs.' },
        { question: 'What are hidden costs of homeownership?', answer: 'Beyond the mortgage: property taxes, homeowner\'s insurance, HOA fees, maintenance (1-2% of home value annually), repairs, closing costs (2-5%), and opportunity cost of your down payment.' },
        { question: 'What is the opportunity cost of a down payment?', answer: 'Money used for a down payment could be invested instead. On a $80,000 down payment earning 7% annually, that is $5,600 per year in potential returns — a key factor favoring renting in some markets.' },
      ]}
      results={
        <>
          <ResultCard label={`${results.years}-Year Buy Cost`} value={formatCurrency(results.final?.buying || 0)} />
          <ResultCard label={`${results.years}-Year Rent Cost`} value={formatCurrency(results.final?.renting || 0)} />
          <ResultCard label="Break-Even Point" value={results.breakEvenYear ? `Year ${results.breakEvenYear}` : 'Beyond comparison period'} highlight />
          <ResultCard label="Verdict" value={results.verdict} variant={results.breakEvenYear ? 'success' : 'warning'} />
          <div className="col-span-full mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="buying" name="Cost of Buying" stroke="#1B4FD8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="renting" name="Cost of Renting" stroke="#0EA5E9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      }
    >
      <InputField label="Home Purchase Price" id="homePrice" value={homePrice.display} onChange={homePrice.onChange} onBlur={homePrice.onBlur} onFocus={homePrice.onFocus} placeholder="400,000" />
      <InputField label="Down Payment" id="downPct" value={downPct.value} onChange={downPct.onChange} placeholder="20" suffix="%" />
      <InputField label="Mortgage Rate" id="mortgageRate" value={mortgageRate.value} onChange={mortgageRate.onChange} placeholder="6.5" suffix="%" />
      <InputField label="Property Tax Rate" id="taxRate" value={taxRate.value} onChange={taxRate.onChange} placeholder="1.2" suffix="%" />
      <InputField label="HOA Fees" id="hoa" value={hoa.display} onChange={hoa.onChange} onBlur={hoa.onBlur} onFocus={hoa.onFocus} placeholder="0" suffix="/mo" />
      <InputField label="Home Insurance" id="homeInsurance" value={homeInsurance.display} onChange={homeInsurance.onChange} onBlur={homeInsurance.onBlur} onFocus={homeInsurance.onFocus} placeholder="150" suffix="/mo" />
      <InputField label="Annual Home Appreciation" id="appreciation" value={appreciation.value} onChange={appreciation.onChange} placeholder="3" suffix="%" />
      <InputField label="Monthly Rent" id="rent" value={rent.display} onChange={rent.onChange} onBlur={rent.onBlur} onFocus={rent.onFocus} placeholder="2,000" />
      <InputField label="Annual Rent Increase" id="rentIncrease" value={rentIncrease.value} onChange={rentIncrease.onChange} placeholder="3" suffix="%" />
      <InputField label="Years to Compare" id="compareYears" value={compareYears.value} onChange={compareYears.onChange} options={[{ value: '5', label: '5 years' }, { value: '10', label: '10 years' }, { value: '15', label: '15 years' }, { value: '30', label: '30 years' }]} />
      <InputField label="Investment Return if Renting" id="investReturn" value={investReturn.value} onChange={investReturn.onChange} placeholder="7" suffix="%" />
    </CalculatorPage>
  );
}
