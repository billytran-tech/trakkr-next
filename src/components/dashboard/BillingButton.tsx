import { functions } from 'config/firebase';
import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';

const BillingButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const redirectToBilling = async () => {
    setIsLoading(true);

    // Call function to create the Checkout session
    const stripeCreateBillingSession = httpsCallable(
      functions,
      'stripeCreateBillingSession'
    );
    const result: any = await stripeCreateBillingSession();
    window.location = result.data?.url;
  };

  return (
    <button className="rounded-md shadow" onClick={() => redirectToBilling()}>
      <a className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
        {isLoading && (
          <svg
            data-testid="loading-svg"
            className={'text-sm animate-spin -ml-1 mr-3 h-5 w-5'}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isLoading ? 'Loading...' : 'Go to billing portal'}
      </a>
    </button>
  );
};

export default BillingButton;
