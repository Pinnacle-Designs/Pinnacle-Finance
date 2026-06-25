export const CALCULATORS = [
  {
    id: 'mortgage',
    name: 'Mortgage Payment Calculator',
    path: '/mortgage-calculator',
    description: 'Estimate monthly mortgage payments with taxes, insurance, and PMI.',
    category: 'home',
    icon: '🏠',
  },
  {
    id: 'home-affordability',
    name: 'Home Affordability Calculator',
    path: '/home-affordability-calculator',
    description: 'Find out how much house you can afford based on income and debt.',
    category: 'home',
    icon: '🏡',
  },
  {
    id: 'rent-vs-buy',
    name: 'Rent vs. Buy Calculator',
    path: '/rent-vs-buy-calculator',
    description: 'Compare the true costs of renting versus buying a home over time.',
    category: 'home',
    icon: '⚖️',
  },
  {
    id: 'loan-payoff',
    name: 'Loan Payoff Calculator',
    path: '/loan-payoff-calculator',
    description: 'See when your loan will be paid off and how much interest you will pay.',
    category: 'debt',
    icon: '📉',
  },
  {
    id: 'credit-card',
    name: 'Credit Card Payoff Calculator',
    path: '/credit-card-payoff-calculator',
    description: 'Calculate how long it takes to pay off credit card debt.',
    category: 'debt',
    icon: '💳',
  },
  {
    id: 'car-payment',
    name: 'Car Payment Calculator',
    path: '/car-payment-calculator',
    description: 'Estimate your monthly car payment and total loan cost.',
    category: 'debt',
    icon: '🚗',
  },
  {
    id: 'dti',
    name: 'Debt-to-Income Calculator',
    path: '/debt-to-income-calculator',
    description: 'Calculate your DTI ratio for mortgage and loan qualification.',
    category: 'debt',
    icon: '📊',
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    path: '/compound-interest-calculator',
    description: 'See how your money grows with compound interest over time.',
    category: 'savings',
    icon: '💰',
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund Calculator',
    path: '/emergency-fund-calculator',
    description: 'Calculate your ideal emergency fund based on monthly expenses.',
    category: 'savings',
    icon: '🛡️',
  },
  {
    id: 'savings-goal',
    name: 'Savings Goal Calculator',
    path: '/savings-goal-calculator',
    description: 'Plan how long to reach a savings goal or what to save monthly.',
    category: 'savings',
    icon: '🎯',
  },
  {
    id: 'investment-return',
    name: 'Investment Return Calculator',
    path: '/investment-return-calculator',
    description: 'Calculate investment returns with or without regular contributions.',
    category: 'investing',
    icon: '📈',
  },
  {
    id: 'retirement',
    name: 'Retirement Savings Calculator',
    path: '/retirement-calculator',
    description: 'See if you are on track for retirement and how much you need.',
    category: 'investing',
    icon: '🏖️',
  },
  {
    id: 'net-worth',
    name: 'Net Worth Calculator',
    path: '/net-worth-calculator',
    description: 'Calculate your net worth from assets and liabilities.',
    category: 'investing',
    icon: '💎',
  },
  {
    id: 'budget',
    name: 'Monthly Budget Planner',
    path: '/budget-planner',
    description: 'Plan your monthly budget and see where your money goes.',
    category: 'planning',
    icon: '📋',
  },
  {
    id: 'tax-bracket',
    name: 'Tax Bracket Calculator',
    path: '/tax-bracket-calculator',
    description: 'Calculate federal income tax and effective rate for 2025.',
    category: 'planning',
    icon: '🧾',
  },
];

export const CATEGORIES = {
  home: { label: 'Home & Mortgage', icon: '🏠' },
  debt: { label: 'Debt & Loans', icon: '💳' },
  savings: { label: 'Savings & Goals', icon: '💰' },
  investing: { label: 'Investing & Retirement', icon: '📈' },
  planning: { label: 'Planning', icon: '📊' },
};

export const NAV_GROUPS = [
  { label: 'Loans', categories: ['home', 'debt'] },
  { label: 'Retirement', categories: ['investing'] },
  { label: 'Budgeting', categories: ['savings', 'planning'] },
  { label: 'Investing', categories: ['investing'] },
];

export function getCalculatorByPath(path) {
  return CALCULATORS.find((c) => c.path === path);
}

export function getRelatedCalculators(currentPath, count = 3) {
  const current = getCalculatorByPath(currentPath);
  if (!current) return CALCULATORS.slice(0, count);
  const sameCategory = CALCULATORS.filter(
    (c) => c.category === current.category && c.path !== currentPath
  );
  const others = CALCULATORS.filter(
    (c) => c.category !== current.category && c.path !== currentPath
  );
  return [...sameCategory, ...others].slice(0, count);
}
