import Spinner from 'components/icons/Spinner';

interface ButtonProps {
  title?: string;
  isLoading?: boolean;
}

const Button = ({
  isLoading = false,
  title,
  children,
  ...buttonProps
}: ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => {
  return (
    <button
      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-royal-red-600 hover:bg-royal-red-500 focus:outline-none focus:border-royal-red-700 focus:shadow-outline-royal-red active:bg-royal-red-700 transition duration-150 ease-in-out"
      {...buttonProps}
    >
      {isLoading ? (
        <Spinner width="20" fill="white" className="animate-spin" />
      ) : (
        title
      )}
      {children}
    </button>
  );
};

export default Button;
