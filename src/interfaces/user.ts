import type { AdditionalUserInfo } from 'firebase/auth';

export interface User {
  uid: string;
  name: string;
  nickname?: string;
  bio?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  twitter?: string;
  teamId: string;
  isAdmin?: boolean;
  isTeamOwner?: boolean;
  isPro?: boolean;
  isHobby?: boolean;
  createdAt?: number;
  avatarUrl?: string;
  emailVerified?: boolean;
}

export type ExtendedUser = User & AdditionalUserInfo;
