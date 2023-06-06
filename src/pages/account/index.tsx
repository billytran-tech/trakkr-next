import Link from 'next/link';

import { useRequireAuth } from 'hooks/useRequireAuth';
import Layout from 'components/dashboard/Layout';
import Button from 'components/shared/Button';
import AccountMenu from 'components/dashboard/AccountMenu';
import BreadCrumbs from 'components/dashboard/BreadCrumbs';
import { getPlan } from 'utils/getPlan';
import { useState, useEffect } from 'react';
import PlanPill from 'components/dashboard/PlanPill';

const breadCrumbs = {
  back: {
    path: '/account',
    text: 'Back',
  },
  first: {
    path: '/account',
    text: 'Account',
  },
  second: {
    path: '/account',
    text: 'General',
  },
};

const Account: React.FC = () => {
  const [plan, setPlan] = useState<null | string>(null);
  const { user } = useRequireAuth();

  useEffect(() => {
    if (user?.teamId && !plan) {
      getPlan(user).then((plan) => setPlan(plan));
    }
  }, [user?.teamId, plan, user]);

  if (!user) return null;

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:leading-9 sm:truncate">
                General
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto overflow-hidden bg-[#1E293B] rounded-lg shadow-lg sm:block">
            <div className="px-4 py-5 pt-5 mt-5 sm:p-6">
              <dl>
                <div className=" sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    {user.name}
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    {user.email}
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Email verified
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    {user.emailVerified ? 'Yes' : 'No'}
                  </dd>
                </div>
                {/* <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Team ID
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    {user.teamId}
                  </dd>
                </div> */}
                {/* <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Team Owner
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    {user.isTeamOwner ? 'Yes' : 'No'}
                  </dd>
                </div> */}
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Plan
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    <PlanPill />
                  </dd>
                </div>
                <div className="mt-8 sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <dt className="text-sm font-medium leading-5 text-white">
                    Photo
                  </dt>
                  <dd className="mt-1 text-sm leading-5 text-gray-100 sm:mt-0 sm:col-span-2">
                    <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                      {user.avatarUrl ? (
                        <span className="relative inline-block">
                          <img
                            className="object-cover w-12 h-12 rounded-full"
                            src={user.avatarUrl}
                            alt={user.name}
                          />
                        </span>
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      )}
                    </span>
                  </dd>
                </div>
              </dl>
              <div className="pt-5 mt-8 border-t border-gray-200">
                <div className="flex justify-end">
                  <span className="rounded-md shadow-sm">
                    <Link href="/account/edit">
                      <Button title="Edit" />
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
