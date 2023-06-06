import { useEffect, useState } from 'react';

import { getPlan } from 'utils/getPlan';
import { useAuth } from 'hooks/useAuth';

const PlanPill: React.FC = () => {
  const [plan, setPlan] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.teamId && !plan) {
      getPlan(user).then((plan) => setPlan(plan));
    }
  }, [user?.teamId, plan, user]);

  if (!user) return null;

  const colors = () => {
    if (!plan || plan === 'Free') return 'bg-indigo-100 text-indigo-800';
    if (plan === 'Hobby' || plan === 'Pro')
      return 'bg-green-100 text-green-800';
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium leading-5 ${colors()}`}
    >
      {plan}
    </span>
  );
};

export default PlanPill;
