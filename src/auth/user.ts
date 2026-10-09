export type UserRole = 'admin' | 'supervisor' | 'asesor';

export interface SystemUser {
  username: string;
  role: UserRole;
}

export const USERS: SystemUser[] = [
  {
    username: 'admin1',
    role: 'admin',
  },
  {
    username: 'supervisor1',
    role: 'supervisor',
  },
  {
    username: 'asesor1',
    role: 'asesor',
  },
  {
    username: 'asesor2',
    role: 'asesor',
  },
];