import { User } from 'interfaces/user';
import { getUser } from 'services/user';

export const getPlan = async (user: User): Promise<string> => {
  let teamOwner;

  if (user.isTeamOwner) {
    teamOwner = user;
  } else {
    // Note: Teams are created with the same ID as the team owner
    teamOwner = await getUser(user.teamId);
  }

  if (teamOwner.isPro) return 'Pro';
  if (teamOwner.isHobby) return 'Hobby';
  return 'Free';
};
