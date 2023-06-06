import AccountMenu from 'components/dashboard/AccountMenu';
import BreadCrumbs from 'components/dashboard/BreadCrumbs';
import Button from 'components/shared/Button';
import ConfirmModal from 'components/dashboard/ConfirmModal';
import Layout from 'components/dashboard/Layout';
import Link from 'next/link';
import Spinner from 'components/icons/Spinner';
import { arrayUnion } from 'firebase/firestore';
import { functions } from 'config/firebase';
import { httpsCallable } from 'firebase/functions';
import { updateTeam } from 'services/team';
import { useForm } from 'react-hook-form';
import { useRequireAuth } from 'hooks/useRequireAuth';
import { useState } from 'react';
import { useTeam } from 'hooks/useTeam';
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
    path: '/account/team',
    text: 'Team',
  },
};

const Team: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { addToast } = useToast();
  const { user } = useRequireAuth();
  const { team } = useTeam();
  const [formOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<string | boolean>(false);
  const [hasResendInvite, setHasResendInvite] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState<string | boolean>(
    false
  );

  if (!user) return null;

  const onSubmit = async (data: { name: string; email: string }) => {
    setIsLoading(true);
    setError(null);

    const payload = {
      status: 'invited',
      invitedAt: Date.now(),
      role: 'member',
      ...data,
    };
    updateTeam(team.id, {
      users: arrayUnion({ ...payload }),
    }).then(() => {
      const sendTeamInviteEmail = httpsCallable(
        functions,
        'sendTeamInviteEmail'
      );
      sendTeamInviteEmail({
        emailTo: data.email,
        teamName: team.name,
        teamId: team.id,
        teamOwnerName: user.name,
      })
        .then(() => {
          setFormOpen(false);
          setIsLoading(false);
          addToast({
            title: 'Invite is sent ✉️',
            description: `An invitation email has been sent to ${data.email}`,
            type: 'success',
          });
        })
        .catch((error) => console.log(error));
    });
  };

  const resendInvite = (email: string) => {
    setIsLoading(email);
    const sendTeamInviteEmail = httpsCallable(functions, 'sendTeamInviteEmail');
    sendTeamInviteEmail({
      emailTo: email,
      teamName: team.name,
      teamId: team.id,
      teamOwnerName: user.name,
    }).then(() => {
      setHasResendInvite(email);
      setFormOpen(false);
      setIsLoading(false);
      addToast({
        title: 'Invite is sent ✉️',
        description: `Once again, an invitation email has been sent to ${email}.`,
        type: 'success',
      });
    });
  };

  const deleteMember = (email: string | boolean) => {
    setIsLoading(true);
    const updatedTeamMembers = team.users.filter(
      (user) => user.email !== email
    );
    const updatedTeam = { ...team, users: updatedTeamMembers };
    updateTeam(team.id, updatedTeam)
      .catch((error) => setError(error))
      .finally(() => {
        setIsLoading(false);
        setShowConfirmModal(false);
        addToast({
          title: 'Member deleted',
          description: `The team member is successfully removed from the team`,
          type: 'success',
        });
      });
  };

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                {team?.name || 'Team'}
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto sm:block">
            {!team && (
              <Spinner width="30" className="m-auto mt-6 animate-spin" />
            )}
            {team && (
              <div>
                <div className="px-4 py-5 pt-5 mt-10 overflow-hidden bg-white rounded-lg shadow-lg sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Your team
                  </h3>
                  <div className="pt-3 my-6 border-t border-gray-200 sm:flex sm:items-start sm:justify-between ">
                    <div className="text-sm leading-5 text-gray-500">
                      <p>{`Team name: ${team.name || ''}`}</p>
                      <p>{`Team ID: ${team.id}`}</p>
                      <p>{`Team Slug: ${team.slug}`}</p>
                      <p>{`Team Member Count: ${team.users.length}`}</p>
                      <p>{`Invite link: https://demo.serverless.page/signup?teamId=${team.id}`}</p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-gray-200">
                    <div className="flex justify-end">
                      <span className="rounded-md shadow-sm">
                        <Link href="/account/team/edit">
                          <Button title="Edit" />
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 pt-5 mt-10 overflow-hidden bg-white rounded-lg shadow-lg sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Team members
                  </h3>
                  <ul className="mt-5">
                    {team?.users.map((member, i) => {
                      return (
                        <li className="border-t border-gray-200" key={i}>
                          <div className="flex items-center justify-between w-full py-6">
                            <div className="flex-1 truncate">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-sm font-medium leading-5 text-gray-900 truncate">
                                  {member.email}
                                </h3>
                                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-teal-800 text-xs leading-4 font-medium bg-teal-100 rounded-full">
                                  {member.role}
                                </span>
                              </div>
                              <p className="mt-1 text-sm leading-5 text-gray-500 truncate">
                                {member.status === 'active'
                                  ? `Joined on ${new Date(
                                      member.joinedAt
                                    ).toLocaleDateString()}`
                                  : `Invited on ${new Date(
                                      member.invitedAt
                                    ).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div className="flex">
                              {member.status !== 'active' &&
                              user.isTeamOwner ? (
                                <button
                                  className="inline-flex justify-center w-full px-4 py-2 mr-3 text-base font-medium leading-6 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue sm:text-sm sm:leading-5"
                                  onClick={() => resendInvite(member.email)}
                                >
                                  {isLoading === member.email
                                    ? 'Sending invite...'
                                    : (hasResendInvite === member.email &&
                                        'Invite is resent') ||
                                      'Resend invite'}
                                </button>
                              ) : (
                                <span className="inline-flex justify-center w-full px-4 py-2 mr-3 text-base font-medium leading-6 text-gray-700 bg-white sm:text-sm sm:leading-5">
                                  {member.status == 'active'
                                    ? 'Active'
                                    : 'Invited'}
                                </span>
                              )}
                              {member.role !== 'owner' && user.isTeamOwner && (
                                <button
                                  className="flex items-center justify-center px-3 py-2 text-sm text-white transition duration-150 ease-in-out bg-red-600 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red sm:text-sm sm:leading-5"
                                  onClick={() =>
                                    setShowConfirmModal(member.email)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="pt-5 border-t border-gray-200">
                    {user.isTeamOwner && !formOpen && (
                      <div className="flex justify-end">
                        <span className="rounded-md shadow-sm">
                          <Button
                            title="Invite a member"
                            onClick={() => setFormOpen(true)}
                          />
                        </span>
                      </div>
                    )}
                    {formOpen && (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        {error?.message && (
                          <div className="p-2 mb-4 text-center text-red-500 border border-red-600 border-dashed rounded">
                            <span>{error.message}</span>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <div className="w-full mr-3 rounded-md">
                            <input
                              id="email"
                              className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
                              type="email"
                              name="email"
                              placeholder="Email"
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

                          <button
                            className="flex justify-center px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-royal-red-600 hover:bg-royal-red-500 focus:outline-none focus:border-royal-red-700 focus:shadow-outline-royal-red active:bg-royal-red-700"
                            type="submit"
                          >
                            {isLoading ? 'Sending...' : 'Send'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          closeModal={() => setShowConfirmModal(false)}
          title={'Are you sure?'}
          text={
            "The team member will be deleted from your team. This user will lose all access to your team's resources. If there is still a pending invitation it will no longer be valid."
          }
          confirmText={isLoading ? 'Deleting...' : 'Delete member'}
          confirmAction={() => deleteMember(showConfirmModal)}
        />
      )}
    </Layout>
  );
};

export default Team;
