import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import AccountMenu from 'components/dashboard/AccountMenu';
import BreadCrumbs from 'components/dashboard/BreadCrumbs';
import ConfirmModal from 'components/dashboard/ConfirmModal';
import Layout from 'components/dashboard/Layout';
import Link from 'next/link';
import { storage } from 'config/firebase';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useRequireAuth } from 'hooks/useRequireAuth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useToast } from 'hooks/useToast';

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
    path: '/account/edit',
    text: 'Edit',
  },
};

const EditAccount: React.FC = () => {
  const { push } = useRouter();
  const { addToast } = useToast();
  const auth = useRequireAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: auth.user?.name,
    },
  });

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      console.log(rejectedFiles);
    }
    const file = acceptedFiles[0];
    if (file.type.includes('image')) {
      handleUpload(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (!auth.user) return null;

  const handleUpload = (image) => {
    const storageRef = ref(storage, `users/${auth.user.uid}/${image?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const currentProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(currentProgress);
      },
      (error) => {
        addToast({
          title: 'Upload failed',
          description: error?.message,
          type: 'error',
        });
      },
      () => {
        addToast({
          title: 'Image uploaded',
          type: 'success',
        });
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setAvatarUrl(downloadURL);
        });
      }
    );
  };

  const onSubmit = (values) => {
    setIsLoading(true);
    setError(null);

    const data = { ...values };
    if (avatarUrl) {
      data.avatarUrl = avatarUrl;
    }

    auth
      .updateUser({ id: auth.user.uid, data })
      .then((response: { error?: { message: string } }) => {
        setIsLoading(false);
        if (response?.error) {
          setError(response.error);
        } else {
          push('/account');
          addToast({
            title: 'Profile updated',
            description: 'You have successfully updated your account',
            type: 'success',
          });
        }
      });
  };

  const deleteAccount = () => {
    setIsLoading(true);
    setError(null);
    auth
      .deleteUser()
      .then(function () {
        addToast({
          title: 'Account deleted',
          description: 'You have successfully deleted your account',
          type: 'success',
        });
        push('/');
      })
      .catch(function (error) {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
        setShowConfirmModal(false);
      });
  };

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:leading-9 sm:truncate">
                Account
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 px-5 py-6 mx-auto overflow-hidden bg-[#1E293B] rounded-lg shadow-lg sm:block sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error?.message && (
                <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                  <span>{error.message}</span>
                </div>
              )}
              <div>
                <div>
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-white">
                      Edit account
                    </h3>
                    <p className="max-w-2xl mt-1 text-sm leading-5 text-gray-100">
                      Update your account information
                    </p>
                  </div>
                  <div className="mt-6 sm:mt-5">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-5 text-white sm:mt-px sm:pt-2"
                      >
                        Name
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-xs rounded-md shadow-sm">
                          <input
                            id="name"
                            name="name"
                            className="block w-full px-3 py-2 bg-transparent transition duration-150 ease-in-out border border-gray-300 text-white rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                            {...register('name', {
                              required: 'Please enter a username',
                            })}
                          />
                          {errors?.name && (
                            <div className="mt-2 text-xs text-red-600">
                              {errors?.name.message}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-5 text-white sm:mt-px sm:pt-2"
                      >
                        Email address
                      </label>
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <div className="max-w-xs mt-1 text-sm leading-5 text-white ">
                          {auth.user.email}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium leading-5 text-white"
                      >
                        Photo
                      </label>
                      <div className="mt-2 sm:mt-0 sm:col-span-2">
                        <div className="flex items-center">
                          <span className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full">
                            {avatarUrl || auth.user.avatarUrl ? (
                              <span className="relative inline-block">
                                <img
                                  className="object-cover w-12 h-12 rounded-md"
                                  src={avatarUrl || auth.user.avatarUrl}
                                  alt={auth.user?.name}
                                />
                              </span>
                            ) : (
                              <svg
                                className="w-full h-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                          </span>
                          <div>
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <span className="ml-5 rounded-md shadow-sm">
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                  >
                                    Drop here
                                  </button>
                                </span>
                              ) : (
                                <span className="ml-5 rounded-md shadow-sm">
                                  <button
                                    type="button"
                                    className="px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                  >
                                    Change
                                  </button>
                                </span>
                              )}
                            </div>
                          </div>
                          {progress && progress !== 100 ? (
                            <div className="max-w-sm ml-3 rounded-md shadow bg-grey-light min-w-64 w-full">
                              <div
                                className="py-1 text-xs leading-none text-center text-white rounded-md bg-royal-red-600"
                                style={{ width: `${progress}%` }}
                              >
                                {`${progress}%`}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5 mt-8 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium leading-5 text-red-500 transition duration-150 ease-in-out border border-red-500 rounded-md hover:text-red-600 focus:outline-none focus:border-red-300 focus:shadow-outline-blue active:bg-red-50 active:text-red-800"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Delete account
                  </button>
                  <div className="flex justify-end">
                    <span className="inline-flex rounded-md shadow-sm">
                      <Link href="/account" legacyBehavior>
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-100 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                        >
                          Cancel
                        </button>
                      </Link>
                    </span>
                    <span className="inline-flex ml-3 rounded-md shadow-sm">
                      <button
                        type="submit"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-royal-red-600 hover:bg-royal-red-500 focus:outline-none focus:border-royal-red-700 focus:shadow-outline-royal-red active:bg-royal-red-700"
                      >
                        {isLoading && (
                          <svg
                            data-testid="loading-svg"
                            className={
                              'text-sm animate-spin -ml-1 mr-3 h-5 w-5'
                            }
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
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          closeModal={() => setShowConfirmModal(false)}
          title={'Are you sure?'}
          text={
            'Your account and any other related data will be permanently deleted. You can not undo this action.'
          }
          confirmText={isLoading ? 'Deleting...' : 'Delete account'}
          confirmAction={() => deleteAccount()}
        />
      )}
    </Layout>
  );
};

export default EditAccount;
