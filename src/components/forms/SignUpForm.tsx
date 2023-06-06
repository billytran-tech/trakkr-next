import { useEffect, useState } from 'react';

import Button from 'components/shared/Button';
import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useToast } from 'hooks/useToast';
import { Checkbox } from '@mui/material';
import Link from 'next/link';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface Props {
  teamId?: string;
  email?: string;
}

const SignUpForm = ({ teamId, email }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      email,
      password: '',
    },
  });
  const { push } = useRouter();
  const { addToast } = useToast();
  const { user, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const onSubmit = (data: SignUpData): void => {
    setIsLoading(true);
    setError(null);
    signUp(data, teamId).then((response: { error?: { message: string } }) => {
      setIsLoading(false);
      if (response?.error) {
        setError(response.error);
      } else {
        push(`/dashboard`);
        addToast({
          title: 'Welcome!👋',
          description:
            'You have successfully registered. Please confirm your email.',
          type: 'success',
        });
      }
    });
  };

  useEffect(() => {
    if (user) {
      push('/dashboard');
    }
  }, [user, push]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error?.message && (
        <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
          <span>{error.message}</span>
        </div>
      )}
      <div className="">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-5 text-white mb-2"
        >
          Full Name *
        </label>
        <div className="absolute flex items-center pl-4 mt-[15px] pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.23743 20.6401C3.68743 20.6401 3.21676 20.4445 2.82543 20.0531C2.43343 19.6611 2.23743 19.1901 2.23743 18.6401V6.64014C2.23743 6.09014 2.43343 5.61947 2.82543 5.22814C3.21676 4.83614 3.68743 4.64014 4.23743 4.64014H20.2374C20.7874 4.64014 21.2584 4.83614 21.6504 5.22814C22.0418 5.61947 22.2374 6.09014 22.2374 6.64014V18.6401C22.2374 19.1901 22.0418 19.6611 21.6504 20.0531C21.2584 20.4445 20.7874 20.6401 20.2374 20.6401H4.23743ZM12.2374 13.4651C12.3208 13.4651 12.4081 13.4525 12.4994 13.4271C12.5914 13.4025 12.6791 13.3651 12.7624 13.3151L19.8374 8.89014C19.9708 8.8068 20.0708 8.7028 20.1374 8.57814C20.2041 8.4528 20.2374 8.31514 20.2374 8.16514C20.2374 7.8318 20.0958 7.5818 19.8124 7.41514C19.5291 7.24847 19.2374 7.2568 18.9374 7.44014L12.2374 11.6401L5.53743 7.44014C5.23743 7.2568 4.94576 7.25247 4.66243 7.42714C4.37909 7.60247 4.23743 7.84847 4.23743 8.16514C4.23743 8.3318 4.27076 8.47747 4.33743 8.60214C4.40409 8.72747 4.50409 8.82347 4.63743 8.89014L11.7124 13.3151C11.7958 13.3651 11.8834 13.4025 11.9754 13.4271C12.0668 13.4525 12.1541 13.4651 12.2374 13.4651Z"
              fill="#B7B7B7"
            />
          </svg>
        </div>
        <input
          id="name"
          className="pl-12 appearance-none max-[600px]:bg-transparent bg-[#2E3033] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
          type="text"
          placeholder="Your Name"
          name="name"
          // value={name}
          // onChange={(e) => {
          //   console.log(e.target.value);
          //   setName(e.target.value);
          // }}
          {...register('name', {
            required: 'Please enter an name',
            minLength: {
              value: 3,
              message: 'name should have at least 3 characters',
            },
          })}
        />
        {errors.name && (
          <p className="mt-2 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-5 text-white"
        >
          Email address *
        </label>
        <div className="mt-2 rounded-md">
          <div className="absolute flex items-center pl-4 mt-[15px] pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.23743 20.6401C3.68743 20.6401 3.21676 20.4445 2.82543 20.0531C2.43343 19.6611 2.23743 19.1901 2.23743 18.6401V6.64014C2.23743 6.09014 2.43343 5.61947 2.82543 5.22814C3.21676 4.83614 3.68743 4.64014 4.23743 4.64014H20.2374C20.7874 4.64014 21.2584 4.83614 21.6504 5.22814C22.0418 5.61947 22.2374 6.09014 22.2374 6.64014V18.6401C22.2374 19.1901 22.0418 19.6611 21.6504 20.0531C21.2584 20.4445 20.7874 20.6401 20.2374 20.6401H4.23743ZM12.2374 13.4651C12.3208 13.4651 12.4081 13.4525 12.4994 13.4271C12.5914 13.4025 12.6791 13.3651 12.7624 13.3151L19.8374 8.89014C19.9708 8.8068 20.0708 8.7028 20.1374 8.57814C20.2041 8.4528 20.2374 8.31514 20.2374 8.16514C20.2374 7.8318 20.0958 7.5818 19.8124 7.41514C19.5291 7.24847 19.2374 7.2568 18.9374 7.44014L12.2374 11.6401L5.53743 7.44014C5.23743 7.2568 4.94576 7.25247 4.66243 7.42714C4.37909 7.60247 4.23743 7.84847 4.23743 8.16514C4.23743 8.3318 4.27076 8.47747 4.33743 8.60214C4.40409 8.72747 4.50409 8.82347 4.63743 8.89014L11.7124 13.3151C11.7958 13.3651 11.8834 13.4025 11.9754 13.4271C12.0668 13.4525 12.1541 13.4651 12.2374 13.4651Z"
                fill="#B7B7B7"
              />
            </svg>
          </div>
          <input
            id="email"
            placeholder="Your Email"
            // value={emailTxt}
            // onChange={(e) => setEmail(e.target.value)}
            className={`pl-12 appearance-none max-[600px]:bg-transparent bg-[#2E3033] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm ${
              !!email && 'cursor-not-allowed'
            }`}
            type="email"
            name="email"
            {...register('email', {
              required: 'Please enter an email',
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Not a valid email',
              },
            })}
          />
          {errors.email && (
            <div className="mt-2 text-xs text-red-600">
              {errors.email.message}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium leading-5 text-white"
        >
          Password *
        </label>
        <div className="mt-2 rounded-md">
          <div className="absolute flex items-center pl-4 mt-3 pointer-events-none">
            <svg
              width="20"
              height="20"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.23743 22.9561C5.68743 22.9561 5.21676 22.7604 4.82543 22.3691C4.43343 21.9771 4.23743 21.5061 4.23743 20.9561V10.9561C4.23743 10.4061 4.43343 9.93505 4.82543 9.54305C5.21676 9.15172 5.68743 8.95605 6.23743 8.95605H7.23743V6.95605C7.23743 5.57272 7.72509 4.39339 8.70043 3.41805C9.67509 2.44339 10.8541 1.95605 12.2374 1.95605C13.6208 1.95605 14.8001 2.44339 15.7754 3.41805C16.7501 4.39339 17.2374 5.57272 17.2374 6.95605V8.95605H18.2374C18.7874 8.95605 19.2584 9.15172 19.6504 9.54305C20.0418 9.93505 20.2374 10.4061 20.2374 10.9561V20.9561C20.2374 21.5061 20.0418 21.9771 19.6504 22.3691C19.2584 22.7604 18.7874 22.9561 18.2374 22.9561H6.23743ZM12.2374 17.9561C12.7874 17.9561 13.2584 17.7604 13.6504 17.3691C14.0418 16.9771 14.2374 16.5061 14.2374 15.9561C14.2374 15.4061 14.0418 14.9351 13.6504 14.5431C13.2584 14.1517 12.7874 13.9561 12.2374 13.9561C11.6874 13.9561 11.2168 14.1517 10.8254 14.5431C10.4334 14.9351 10.2374 15.4061 10.2374 15.9561C10.2374 16.5061 10.4334 16.9771 10.8254 17.3691C11.2168 17.7604 11.6874 17.9561 12.2374 17.9561ZM9.23743 8.95605H15.2374V6.95605C15.2374 6.12272 14.9458 5.41439 14.3624 4.83105C13.7791 4.24772 13.0708 3.95605 12.2374 3.95605C11.4041 3.95605 10.6958 4.24772 10.1124 4.83105C9.52909 5.41439 9.23743 6.12272 9.23743 6.95605V8.95605Z"
                fill="#B7B7B7"
              />
            </svg>
          </div>
          <input
            id="password"
            placeholder="Password"
            // value={password}
            // onChange={(e) => setPassword(e.target.value)}
            className="block pl-12 w-full max-[600px]:bg-transparent bg-[#2E3033] px-3 py-4 h-[48px] placeholder-gray-400 text-[#B7B7B7] transition duration-150 ease-in-out rounded-md shadow-sm appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            type="password"
            name="password"
            {...register('password', {
              required: 'Please enter a password',
              minLength: {
                value: 6,
                message: 'Should have at least 6 characters',
              },
            })}
          />
          {errors.password && (
            <div className="mt-2 text-xs text-red-600">
              {errors.password.message}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row mb-[0.125rem] mt-8 block min-h-[1.5rem]">
        <Checkbox
          className="p-0 m-0"
          sx={{
            color: 'white',
            '&.Mui-checked': {
              color: 'white',
            },
            padding: 0,
            margin: 0,
          }}
          defaultChecked
          color="primary"
          checked={checked2}
          onChange={() => setChecked2(!checked2)}
          id="checkboxDefault2"
        />
        <label className="my-auto inline-block pl-[0.15rem] text-xs text-white hover:cursor-pointer">
          I agree to the{' '}
          <a href="/" className="text-red-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/" className="text-red-500">
            Privacy Policy
          </a>
        </label>
      </div>
      <div className="flex flex-row mb-[0.125rem] mt-4 block min-h-[1.5rem]">
        <Checkbox
          className="p-0 m-0"
          sx={{
            color: 'white',
            '&.Mui-checked': {
              color: 'white',
            },
            padding: 0,
            margin: 0,
          }}
          defaultChecked
          color="primary"
          checked={checked}
          onChange={() => setChecked(!checked)}
          id="checkboxDefault"
        />
        <label className="my-auto inline-block pl-[0.15rem] text-xs text-white hover:cursor-pointer">
          I understand Trakkr is a simulation software and Trakkr is NOT a
          broker.
        </label>
      </div>
      <div className="mt-8">
        <span className="block w-full rounded-2xl shadow-sm">
          <Button
            disabled={
              getValues().email == '' ||
              getValues.name == '' ||
              getValues().password == '' ||
              checked == false ||
              checked2 == false
                ? true
                : false
            }
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md ${
              getValues().email == '' ||
              getValues.name == '' ||
              getValues().password == '' ||
              checked == false ||
              checked2 == false
                ? 'bg-[#182234] text-[#475569] max-[600px]:bg-transparent'
                : 'bg-[#FAFAFA] text-black hover:bg-gray-200 transition duration-150 ease-in-out'
            }`}
            title="Create your account"
            type="submit"
            isLoading={isLoading}
          />
        </span>
      </div>
      <p className="mt-8 text-[#99B2C6] text-secondary">
        {'Already have an account?'}{' '}
        <Link href="/sign-in" className="text-white">
          Log In
        </Link>
      </p>
      <div className="flex flex-row mt-8">
        <svg
          width="15"
          height="14"
          viewBox="0 0 17 16"
          className="my-auto mr-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_0_16)">
            <path
              d="M8.48564 1.83104C12.0823 1.83104 14.9795 4.60145 14.9795 8.04059C14.9795 11.4797 12.0823 14.2501 8.48564 14.2501C4.88903 14.2501 1.99175 11.4797 1.99175 8.04059C1.99175 4.60145 4.88903 1.83104 8.48564 1.83104ZM8.48564 0.398071C4.08978 0.398071 0.493164 3.8372 0.493164 8.04059C0.493164 12.244 4.08978 15.6831 8.48564 15.6831C12.8815 15.6831 16.4781 12.244 16.4781 8.04059C16.4781 3.8372 12.8815 0.398071 8.48564 0.398071Z"
              fill="#99B2C6"
            />
            <path
              d="M10.3839 10.2378C9.88432 10.6199 9.18498 10.9065 8.48564 10.9065C6.78724 10.9065 5.48846 9.66462 5.48846 8.04058C5.48846 6.41655 6.78724 5.17464 8.48564 5.17464C9.28489 5.17464 10.0841 5.46123 10.5837 6.03442L11.6826 4.98358C10.8834 4.21933 9.68451 3.74167 8.48564 3.74167C5.98799 3.74167 3.98987 5.6523 3.98987 8.04058C3.98987 10.4289 5.98799 12.3395 8.48564 12.3395C9.5846 12.3395 10.4838 11.9574 11.283 11.3842L10.3839 10.2378Z"
              fill="#99B2C6"
            />
          </g>
          <defs>
            <clipPath id="clip0_0_16">
              <rect
                width="15.985"
                height="15.285"
                fill="white"
                transform="translate(0.493164 0.398071)"
              />
            </clipPath>
          </defs>
        </svg>
        <div className="my-auto text-[#99B2C6] text-xs">
          Copyright trakkr 2023
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
