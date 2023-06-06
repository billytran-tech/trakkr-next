export interface Team {
  id: string;
  name: string;
  ownerId: string;
  slug: string;
  users: TeamUser[];
}

interface TeamUser {
  uid: string;
  email: string;
  name: string;
  role: 'owner' | 'member';
  status: string;
  joinedAt: number;
  invitedAt: number;
}
