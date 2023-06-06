import { useRef, useState } from 'react';

import Link from 'next/link';
// import PlanPill from './PlanPill';
import { Transition } from '@headlessui/react';
import { useAuth } from 'hooks/useAuth';
import { useOnClickOutside } from 'hooks/useClickOutside';
import { useRouter } from 'next/router';
import { useToast } from 'hooks/useToast';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const auth = useAuth();
  const dropdownNode = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useOnClickOutside(dropdownNode, () => setDropdownOpen(false));

  if (!auth.user) return null;

  const signOut = () => {
    auth.signOut().then(() =>
      addToast({
        title: 'Until next time!👋',
        description: 'You are successfully signed out.',
        type: 'success',
      })
    );
  };

  return (
    <nav className="bg-transparent shadow-md border-b-[0.02px] border-slate-700">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="">
          <div className="flex items-center justify-between h-16 px-4 sm:px-0">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex">
                <img
                  className="w-auto w-40 sm:h-10"
                  src="/img/logo.svg"
                  alt="Serverless SaaS Boilerplate"
                />
              </Link>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10">
                  <Link
                    href="/dashboard"
                    className={
                      router.pathname === '/dashboard'
                        ? 'mr-4 px-3 py-2 rounded text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:text-gray-600 focus:bg-gray-800 flex'
                        : 'mr-4 px-3 py-2 rounded text-sm font-medium text-white hover:text-gray-100 hover:bg-gray-700 focus:outline-none focus:bg-gray-800 flex'
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="gray"
                      height="24"
                      width="24"
                      preserveAspectRatio="xMidYMid meet"
                      focusable="false"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      ></path>
                    </svg>
                    {'  '}
                    Backtesting
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-row items-center md:flex">
              {/* <div>
                <PlanPill />
              </div> */}
              <div className="flex items-center ml-4 md:ml-6">
                <div className="relative ml-3 z-10" ref={dropdownNode}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center max-w-xs text-sm text-white rounded-full focus:outline-none focus:shadow-solid"
                  >
                    <span className="inline-block w-8 h-8 overflow-hidden bg-gray-900 rounded-full">
                      {auth.user?.avatarUrl ? (
                        <img
                          className="object-cover w-full h-full rounded"
                          src={auth.user.avatarUrl}
                          alt={auth.user.name}
                        />
                      ) : (
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="gray"
                            height="100%"
                            width="100%"
                            preserveAspectRatio="xMidYMid meet"
                            focusable="false"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span className="absolute right-0 bottom-0 w-2 h-2 rounded-full mr-px mb-px bg-green-500"></span>
                        </div>
                      )}
                    </span>
                  </button>

                  <Transition
                    show={dropdownOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <div className="absolute z-10 right-0 w-48 mt-2 origin-top-right rounded-lg shadow-xl">
                      <div className="py-1 bg-[#1e293b] rounded shadow-xs">
                        <Link
                          href="/account"
                          className="block flex px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="mr-2"
                            height="24"
                            width="24"
                            preserveAspectRatio="xMidYMid meet"
                            focusable="false"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          Manage Account
                        </Link>
                        {/* <Link
                          href="/account/team"
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          Team
                        </Link> */}
                        {/* <Link
                          href="/account/billing"
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          Billing
                        </Link> */}
                        {auth.user?.isAdmin && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-white hover:bg-gray-100"
                          >
                            Admin
                          </Link>
                        )}
                        <a
                          href="/"
                          className="block flex px-4 py-2 text-sm text-white hover:bg-gray-700"
                          onClick={() => signOut()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="mr-2"
                            height="24"
                            width="24"
                            preserveAspectRatio="xMidYMid meet"
                            focusable="false"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                          </svg>
                          Sign out
                        </a>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
            {/* <div className="flex -mr-2 md:hidden" ref={hamburgerNode}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-600 rounded hover:text-gray-900 hover:bg-gray-700 focus:outline-none focus:bg-transparent focus:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {navbarOpen ? (
                    <path
                      className="inline-flex"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      className="inline-flex"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </div>
      {/* {navbarOpen && (
        <div
          className="block border-b border-gray-200 md:hidden"
          ref={navbarNode}
        >
          <div className="px-2 py-3 sm:px-3">
            <Link
              href="/dashboard"
              className={
                router.pathname?.includes('dashboard')
                  ? 'block px-3 py-2 rounded text-base font-medium text-white focus:outline-none focus:text-white'
                  : 'block px-3 py-2 rounded text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100'
              }
            >
              Backtesting
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                {auth.user?.avatarUrl ? (
                  <img
                    className="object-cover w-12 h-12 rounded-full"
                    src={auth.user.avatarUrl}
                    alt={auth.user.name}
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-300 rounded-full"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {auth.user.name}
                </div>
                <div className="mt-1 text-sm font-medium leading-none text-gray-600">
                  {auth.user.email}
                </div>
              </div>
            </div>
            <div className="px-2 mt-3">
              <a
                href="/#"
                className="block px-3 py-2 mt-1 text-base font-medium text-gray-600 rounded hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-white focus:bg-gray-100"
                onClick={() => signOut()}
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      )} */}
    </nav>
  );
};

export default Navbar;
