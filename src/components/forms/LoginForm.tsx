import { useCallback, useEffect, useState } from 'react';

import Button from 'components/shared/Button';
import Link from 'next/link';
import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useToast } from 'hooks/useToast';
import { Checkbox } from '@mui/material';
import axios from 'axios';

interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { push } = useRouter();
  const { addToast } = useToast();
  const { user, signIn, signWithGoogle, signWithTwitter, signWithDiscord } =
    useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [discordName, setDiscordName] = useState('DISCORD');
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    if (user) {
      push('/dashboard');
    }
  }, [user, push]);

  const onSubmit = (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    signIn(data).then((response: { error?: { message: string } }) => {
      setIsLoading(false);
      if (response?.error) {
        setError(response.error);
      } else {
        push('/dashboard');
        addToast({
          title: 'Welcome back!👋',
          description: 'You are successfully signed in.',
          type: 'success',
        });
      }
    });
  };

  const signWithGoogleAction = (e) => {
    e.preventDefault();
    setError(null);
    signWithGoogle().then((response: { error?: { message: string } }) => {
      console.log(response);
      setError(null);
    });
  };
  const signWithTwitterAction = (e) => {
    e.preventDefault();
    setError(null);
    signWithTwitter().then((response: { error?: { message: string } }) => {
      console.log(response);
      setError(null);
    });
  };

  const getUserInfo = async (accessToken: any) => {
    try {
      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          authorization: `${accessToken.data.token_type} ${accessToken.data.access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getToken = async (code: any) => {
    try {
      const options = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL,
        scope: 'identify',
      });
      const result = await axios.post(
        'https://discord.com/api/oauth2/token',
        options
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const getInfo = useCallback(
    async (code: any) => {
      const accessToken = await getToken(code);
      const userInfo = await getUserInfo(accessToken);
      console.log(userInfo);
      setDiscordName(userInfo.username);
      console.log(discordName);
      await signWithDiscord(userInfo.username);
    },
    [signWithDiscord]
  );

  const handleAuth = useCallback(
    (event: MessageEvent) => {
      console.log('Handling authentication');

      if (event.origin !== window.location.origin) {
        console.log(
          'Origin check failed:',
          event.origin,
          window.location.origin
        );
        return;
      }

      if (event.data.type === 'authentication') {
        const code = event.data.code;
        console.log(`Access token: ${code}`);

        if (popup) popup?.close();

        if (!code) return;
        getInfo(code);

        // alert('succes');
      }
    },
    [getInfo, popup]
  );

  const handleDiscordClick = useCallback(() => {
    const p = window.open(
      process.env.NEXT_PUBLIC_DISCORD_AUTH_LINK,
      'Discord Authentication',
      'location,status,scrollbars,resizable,width=600, height=800'
    );
    setPopup(p);

    console.log('Adding event listener');
    window.addEventListener('message', handleAuth);

    return () => {
      console.log('Removing event listener');
      window.removeEventListener('message', handleAuth);
    };
  }, [handleAuth]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error?.message && (
        <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
          <span>{error.message}</span>
        </div>
      )}
      <div className="rounded-md">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-5 text-white"
        >
          Your email
        </label>
        <div className="mt-1 rounded-md">
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
            className={`pl-12 appearance-none max-[600px]:bg-transparent bg-[#2E3033] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm`}
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
          Password
        </label>
        <div className="mt-1 rounded-md">
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

      <div className="flex items-end mt-8 space-between">
        <div className="flex flex-row h-full w-full text-sm leading-5 space-between place-content-between">
          <div className="flex flex-row">
            <Checkbox
              sx={{
                color: 'white',
                '&.Mui-checked': {
                  color: 'white',
                },
              }}
              defaultChecked
              color="primary"
            />
            <p className="text-white my-auto text-xs align-middle text-center">
              Keep me signed in
            </p>
          </div>
          <Link
            href="/reset-password"
            className="font-medium my-auto justify-self-end transition duration-150 ease-in-out text-white text-xs hover:text-gray-100 focus:outline-none focus:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <span className="block w-full rounded-md shadow-sm">
          <Button
            className="w-full flex place-self-end justify-center mb-20 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#FAFAFA] hover:bg-gray-300 transition duration-150 ease-in-out"
            title="Login"
            type="submit"
            isLoading={isLoading}
          />
        </span>
      </div>
      <div className="flex items-center mt-8 text-white">
        <div className="mx-2 text-secondary ng-tns-c131-32">
          or continue with open account
        </div>
      </div>
      <div className="flex flex-row space-x-2">
        <button
          onClick={(e) => signWithGoogleAction(e)}
          className="mt-8 w-full flex text-white text-[14px] text-center place-content-center rounded-md bg-[#2E3033] py-4"
        >
          <svg
            enableBackground="new 0 0 533.5 544.3"
            version="1.1"
            viewBox="0 0 533.5 544.3"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            className="mr-2"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="m533.5 278.4c0-18.5-1.5-37.1-4.7-55.3h-256.7v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
              style={{ fill: '#4285f4' }}
            ></path>
            <path
              d="m272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3h-90.5v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
              style={{ fill: '#34a853' }}
            ></path>
            <path
              d="M119.3,324.3c-11.4-33.8-11.4-70.4,0-104.2V150H28.9c-38.6,76.9-38.6,167.5,0,244.4L119.3,324.3z"
              style={{ fill: '#fbbc04' }}
            ></path>
            <path
              d="m272.1 107.7c38.8-0.6 76.3 14 104.4 40.8l77.7-77.7c-49.2-46.2-114.5-71.6-182.1-70.8-102.9 0-197 58-243.2 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
              style={{ fill: '#ea4335' }}
            ></path>
          </svg>
          Google
        </button>
        <button
          onClick={(e) => signWithTwitterAction(e)}
          className="mt-8 w-full flex text-white text-[14px] text-center place-content-center rounded-md bg-[#2E3033] py-4"
        >
          <svg
            width="20"
            height="20"
            className="mr-2"
            viewBox="0 0 35 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect
              x="0.737427"
              y="0.787598"
              width="34"
              height="36"
              fill="url(#pattern0840u51)"
            />
            <defs>
              <pattern
                id="pattern0840u51"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_0_42"
                  transform="matrix(0.00206801 0 0 0.00195312 -0.0294118 0)"
                />
              </pattern>
              <image
                id="image0_0_42"
                width="512"
                height="512"
                xlinkHref="data:image/png;base64,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"
              />
            </defs>
          </svg>
          Twitter
        </button>
        <button
          onClick={() => handleDiscordClick()}
          className="mt-8 w-full flex text-white text-[14px] text-center place-content-center rounded-md bg-[#2E3033] py-4"
        >
          <svg
            width="20"
            height="20"
            className="mr-2"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_0_45)">
              <path
                d="M23.2062 0.787598H7.26868C3.38542 0.787598 0.237427 3.9356 0.237427 7.81885V23.7563C0.237427 27.6396 3.38542 30.7876 7.26868 30.7876H23.2062C27.0894 30.7876 30.2374 27.6396 30.2374 23.7563V7.81885C30.2374 3.9356 27.0894 0.787598 23.2062 0.787598Z"
                fill="#5865F2"
              />
              <mask
                id="mask0_0_45"
                style={{ maskType: 'luminance' }}
                maskUnits="userSpaceOnUse"
                x="3"
                y="6"
                width="24"
                height="19"
              >
                <path
                  d="M3.51868 6.76416H26.9562V24.92H3.51868V6.76416Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_0_45)">
                <path
                  d="M23.3594 8.38099C21.84 7.68347 20.2364 7.18607 18.5889 6.90126C18.5739 6.89849 18.5584 6.90051 18.5447 6.90703C18.5309 6.91356 18.5196 6.92425 18.5122 6.93759C18.3062 7.30392 18.0779 7.78204 17.9182 8.15775C16.1167 7.88798 14.3245 7.88798 12.56 8.15775C12.4002 7.77361 12.1637 7.30392 11.9568 6.93759C11.9491 6.92452 11.9377 6.91407 11.924 6.90758C11.9103 6.9011 11.895 6.8989 11.88 6.90126C10.2323 7.1855 8.62869 7.68292 7.10941 8.38099C7.0964 8.38651 7.08543 8.39593 7.078 8.40794C4.03957 12.9473 3.2073 17.3751 3.61558 21.7481C3.61672 21.7588 3.62 21.7692 3.62524 21.7786C3.63047 21.788 3.63755 21.7963 3.64605 21.8029C5.65066 23.2752 7.59257 24.169 9.49839 24.7613C9.51322 24.7658 9.52904 24.7656 9.54374 24.7607C9.55844 24.7559 9.57132 24.7467 9.58066 24.7344C10.0315 24.1187 10.4333 23.4696 10.778 22.787C10.7827 22.7776 10.7854 22.7674 10.7859 22.7569C10.7864 22.7464 10.7847 22.736 10.7808 22.7262C10.777 22.7165 10.7711 22.7076 10.7636 22.7003C10.7561 22.693 10.7471 22.6873 10.7373 22.6837C10.0998 22.4418 9.49289 22.1471 8.90906 21.8123C8.89842 21.8061 8.88949 21.7973 8.88306 21.7867C8.87662 21.7762 8.87287 21.7643 8.87214 21.7519C8.87141 21.7396 8.87372 21.7273 8.87887 21.7161C8.88402 21.7049 8.89185 21.6951 8.90167 21.6876C9.02484 21.5956 9.14588 21.5007 9.26472 21.4031C9.27512 21.3945 9.28773 21.389 9.3011 21.3871C9.31448 21.3853 9.3281 21.3873 9.34042 21.3928C13.1762 23.144 17.3287 23.144 21.1192 21.3928C21.1315 21.3869 21.1453 21.3847 21.1589 21.3864C21.1725 21.388 21.1853 21.3935 21.1959 21.4022C21.3149 21.5003 21.4362 21.5955 21.5599 21.6876C21.5698 21.695 21.5777 21.7047 21.5829 21.7159C21.5881 21.7271 21.5905 21.7394 21.5899 21.7517C21.5893 21.764 21.5856 21.776 21.5793 21.7866C21.5729 21.7971 21.564 21.806 21.5535 21.8123C20.9693 22.1534 20.3574 22.4446 19.7243 22.6828C19.7145 22.6865 19.7055 22.6923 19.6981 22.6998C19.6907 22.7072 19.6849 22.7162 19.6811 22.726C19.6774 22.7358 19.6757 22.7463 19.6763 22.7568C19.6769 22.7674 19.6797 22.7776 19.6846 22.787C20.0352 23.4642 20.435 24.1147 20.8808 24.7335C20.8899 24.7461 20.9027 24.7556 20.9175 24.7606C20.9322 24.7656 20.9482 24.7659 20.9631 24.7613C22.8782 24.169 24.8201 23.2752 26.8248 21.8029C26.8334 21.7966 26.8405 21.7885 26.8458 21.7792C26.851 21.77 26.8543 21.7597 26.8553 21.749C27.3439 16.6935 26.0367 12.3018 23.3899 8.40888C23.3834 8.39623 23.3726 8.38633 23.3594 8.38099ZM11.3508 19.0855C10.1959 19.0855 9.24433 18.0253 9.24433 16.7232C9.24433 15.4211 10.1775 14.361 11.3508 14.361C12.5332 14.361 13.4755 15.4305 13.457 16.7232C13.457 18.0253 12.5241 19.0855 11.3508 19.0855ZM19.1386 19.0855C17.9837 19.0855 17.0323 18.0253 17.0323 16.7232C17.0323 15.4211 17.9653 14.361 19.1386 14.361C20.321 14.361 21.2633 15.4305 21.2449 16.7232C21.2449 18.0253 20.321 19.0855 19.1386 19.0855Z"
                  fill="white"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_0_45">
                <rect
                  width="30"
                  height="30"
                  fill="white"
                  transform="translate(0.237427 0.787598)"
                />
              </clipPath>
            </defs>
          </svg>
          Discord
        </button>
      </div>
      <p className="mt-8 text-[#99B2C6] text-secondary">
        {'not registered yet?'}{' '}
        <Link href="/signup" className="text-white">
          Try Sign up
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

export default LoginForm;
