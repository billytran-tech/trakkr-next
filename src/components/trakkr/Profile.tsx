import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useRequireAuth } from 'hooks/useRequireAuth';
import { useToast } from 'hooks/useToast';
import React, { useState } from 'react';
import { storage } from 'config/firebase';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

const Profile = ({ setMenu, menu }): JSX.Element => {
  //   const [_error, setError] = useState(null);
  //   const { user } = useRequireAuth();
  const { addToast } = useToast();
  const auth = useRequireAuth();
  const [progress, setProgress] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: auth.user?.name,
      nickname: auth.user?.nickname,
      email: auth.user?.email,
      phone: auth.user?.phone,
      bio: auth.user?.bio,
      instagram: auth.user?.instagram,
      twitter: auth.user?.twitter,
    },
  });

  const onSubmit = (values) => {
    // setIsLoading(true);
    // setError(null);

    const data = { ...values };
    if (avatarUrl) {
      data.avatarUrl = avatarUrl;
    }

    auth
      .updateUser({ id: auth.user.uid, data })
      .then((response: { error?: { message: string } }) => {
        // setIsLoading(false);
        if (response?.error) {
          //   setError(response.error);
          console.log(response.error);
        } else {
          //   push('/account');
          addToast({
            title: 'Profile updated',
            description: 'You have successfully updated your account',
            type: 'success',
          });
        }
      });
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length) {
      console.log(rejectedFiles);
    }
    const file = acceptedFiles[0];
    if (file.type.includes('image')) {
      handleUpload(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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

  return (
    <div className="flex flex-col w-full h-full md:h-screen space-y-4">
      <div className="flex place-content-between">
        <p className="text-2xl text-white">Your Profile</p>
        <div className="flex md:hidden w-2/12 sm:1/5 bg-[#2E3033] h-12 my-auto rounded-[15px] w-1/6 h-fit">
          <button onClick={() => setMenu(!menu)} className="mx-auto my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6 mx-auto my-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative w-full h-full bg-[#2E3033] rounded-[15px]">
        <div className="bg-cover bg-[url('/img/profilebg.png')] bg-center h-64 md:h-2/6 rounded-[15px]"></div>
        <div className="-mt-4 px-10 bg-[#2E3033] w-full rounded-[15px] h-4/6">
          <div
            className={`absolute top-40 bg-cover bg-center h-40 w-40 ${
              avatarUrl || auth.user?.avatarUrl
                ? ''
                : "bg-[url('/img/avatar.svg')]"
            } rounded-full`}
            style={{
              backgroundImage:
                (avatarUrl || auth.user?.avatarUrl) &&
                `url('${avatarUrl || auth.user?.avatarUrl}')`,
            }}
          >
            <div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button type="button">
                  <svg
                    width="40"
                    height="40"
                    className="ml-32 mt-6"
                    viewBox="0 0 49 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="49" height="47" rx="20" fill="black" />
                    <path
                      d="M16 16V13H18V16H21V18H18V21H16V18H13V16H16ZM19 22V19H22V16H29L30.83 18H34C35.1 18 36 18.9 36 20V32C36 33.1 35.1 34 34 34H18C16.9 34 16 33.1 16 32V22H19ZM26 31C28.76 31 31 28.76 31 26C31 23.24 28.76 21 26 21C23.24 21 21 23.24 21 26C21 28.76 23.24 31 26 31ZM22.8 26C22.8 27.77 24.23 29.2 26 29.2C27.77 29.2 29.2 27.77 29.2 26C29.2 24.23 27.77 22.8 26 22.8C24.23 22.8 22.8 24.23 22.8 26Z"
                      fill="#B8B8B8"
                    />
                  </svg>
                </button>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex place-content-end pt-6">
              <button type="submit" className="bg-white rounded-2xl px-10 py-2">
                Save
              </button>
            </div>
            <div className="flex flex-col md:flex-row mt-16 space-y-8 md:space-x-8 lg:space-x-20 md:space-y-0">
              <div className="w-full lg:w-1/3 md:w-2/5 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    {...register('name')}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    type="text"
                    placeholder="Full Name"
                    name="name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Nick Name
                  </label>
                  <input
                    id="nickname"
                    {...register('nickname')}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    type="text"
                    placeholder="Nick Name"
                    name="nickname"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    {...register('email')}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    type="text"
                    placeholder="Email"
                    name="email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    {...register('phone')}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    type="text"
                    placeholder="Phone"
                    name="phone"
                  />
                </div>
              </div>
              <div className="w-full lg:w-1/3 md:w-2/5 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    {...register('bio')}
                    style={{ resize: 'none' }}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[140px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    rows={6}
                    cols={5}
                    placeholder="Bio"
                    name="bio"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Instagram
                  </label>
                  <input
                    id="instagram"
                    {...register('instagram')}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    type="text"
                    placeholder="Instagram"
                    name="instagram"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-5 text-[#B8B8B8] mb-2"
                  >
                    Twitter
                  </label>
                  <input
                    id="twitter"
                    {...register('twitter')}
                    className="pl-6 appearance-none bg-[#1A1B1E] h-[48px] block w-full px-3 py-4 text-[#B7B7B7] rounded-md placeholder-[#B7B7B7] focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out sm:text-sm sm:leading-5 shadow-sm"
                    type="text"
                    placeholder="Twitter"
                    name="twitter"
                  />
                </div>
              </div>
              <div className="w-full pb-10 lg:w-1/3 md:w-1/5 w-full mx-auto">
                <button
                  type="button"
                  className="text-[#99B2C6] text-sm mt-6 mx-auto w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
