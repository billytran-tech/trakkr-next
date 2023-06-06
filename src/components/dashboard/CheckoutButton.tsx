import { functions } from 'config/firebase';
import { httpsCallable } from 'firebase/functions';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from 'hooks/useAuth';
import { useState } from 'react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const CheckoutButton = ({ plan }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const redirectToCheckout = async () => {
    setIsLoading(true);

    // Call function to create the Checkout session
    const stripeCreateCheckoutSession = httpsCallable(
      functions,
      'stripeCreateCheckoutSession'
    );
    const result: any = await stripeCreateCheckoutSession({
      email: auth.user.email,
      priceId: plan.priceId,
    });

    const stripe = await stripePromise;

    // When the customer clicks on the button, redirect them to Checkout.
    const { error } = await stripe.redirectToCheckout({
      sessionId: result.data.id,
    });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    if (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <button className="rounded-md shadow" onClick={redirectToCheckout}>
      <span className="flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
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
        {isLoading ? 'Loading...' : plan.title}
      </span>
    </button>
  );
};

export default CheckoutButton;
