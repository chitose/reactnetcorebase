// Auto-generated using typewriter -> from model.tst


import { Role } from './role';
export interface User {
  userName: string;
  firstName: string;
  lastName: string;
  roleId: number;
  role: Role;
  securityStamp: string;
  lockoutEnd: Date;
  lockoutEnabled: boolean;
  id: number;
  displayName?: string;
  author?: string;
  authorId?: number;
  editor?: string;
  editorId?: number;
  modified?: Date;
  created?: Date;
}