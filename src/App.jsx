import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTER_BASENAME } from './config/brand';
import Layout from './components/Layout';
import Home from './pages/Home';
import MortgageCalculator from './calculators/MortgageCalculator';
import LoanPayoffCalculator from './calculators/LoanPayoffCalculator';
import CompoundInterestCalculator from './calculators/CompoundInterestCalculator';
import DebtToIncomeCalculator from './calculators/DebtToIncomeCalculator';
import RetirementSavingsCalculator from './calculators/RetirementSavingsCalculator';
import CreditCardPayoffCalculator from './calculators/CreditCardPayoffCalculator';
import CarPaymentCalculator from './calculators/CarPaymentCalculator';
import HomeAffordabilityCalculator from './calculators/HomeAffordabilityCalculator';
import EmergencyFundCalculator from './calculators/EmergencyFundCalculator';
import NetWorthTracker from './calculators/NetWorthTracker';
import SavingsGoalCalculator from './calculators/SavingsGoalCalculator';
import BudgetPlanner from './calculators/BudgetPlanner';
import InvestmentReturnCalculator from './calculators/InvestmentReturnCalculator';
import RentVsBuyCalculator from './calculators/RentVsBuyCalculator';
import TaxBracketCalculator from './calculators/TaxBracketCalculator';

export default function App() {
  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mortgage-calculator" element={<MortgageCalculator />} />
          <Route path="loan-payoff-calculator" element={<LoanPayoffCalculator />} />
          <Route path="compound-interest-calculator" element={<CompoundInterestCalculator />} />
          <Route path="debt-to-income-calculator" element={<DebtToIncomeCalculator />} />
          <Route path="retirement-calculator" element={<RetirementSavingsCalculator />} />
          <Route path="credit-card-payoff-calculator" element={<CreditCardPayoffCalculator />} />
          <Route path="car-payment-calculator" element={<CarPaymentCalculator />} />
          <Route path="home-affordability-calculator" element={<HomeAffordabilityCalculator />} />
          <Route path="emergency-fund-calculator" element={<EmergencyFundCalculator />} />
          <Route path="net-worth-calculator" element={<NetWorthTracker />} />
          <Route path="savings-goal-calculator" element={<SavingsGoalCalculator />} />
          <Route path="budget-planner" element={<BudgetPlanner />} />
          <Route path="investment-return-calculator" element={<InvestmentReturnCalculator />} />
          <Route path="rent-vs-buy-calculator" element={<RentVsBuyCalculator />} />
          <Route path="tax-bracket-calculator" element={<TaxBracketCalculator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
