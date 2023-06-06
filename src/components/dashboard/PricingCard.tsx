import { Pricing } from 'interfaces/pricing';
import StripeCheckoutButton from './CheckoutButton';
import USPList from './USPList';

interface Props {
  plan: Pricing;
}

const PricingCard = ({ plan }: Props) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-1/2"></div>
      <div className="relative">
        <div className="overflow-hidden rounded-lg shadow-lg">
          <div className="px-6 py-8 bg-[#1E293B] lg:flex-shrink-1 lg:p-12">
            <h3 className="text-2xl font-extrabold leading-8 text-white sm:text-3xl sm:leading-9">
              {plan.title}
            </h3>
            <p className="mt-6 text-base leading-6 text-gray-300">
              {plan.description}
            </p>
            <div className="mt-8">
              <div className="flex items-center">
                <h4 className="flex-shrink-0 pr-4 text-sm font-semibold leading-5 tracking-wider uppercase bg-[#1E293B] text-red-600">
                  {`What's included`}
                </h4>
                <div className="flex-1 border-t-2 border-gray-200"></div>
              </div>
              <USPList usps={plan.usps} />
            </div>
          </div>
          <div className="px-6 pb-8 text-center bg-[#1E293B] lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:px-12 lg:pb-12">
            <p className="text-lg font-medium leading-6 text-white">
              Price per month
            </p>
            <div className="flex items-center justify-center mt-4 text-5xl font-extrabold leading-none text-white">
              <span>{plan.price}</span>
              <span className="ml-3 text-xl font-medium leading-7 text-gray-500">
                USD
              </span>
            </div>
            <div className="mt-6">
              <StripeCheckoutButton plan={plan} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
