// Auto-generated using typewriter -> from model.tst


import { RoleRight } from './roleRight';
export interface Role {
  name: string;
  description: string;
  rights: RoleRight[];
  id: number;
  author?: string;
  authorId?: number;
  editor?: string;
  editorId?: number;
  modified?: Date;
  created?: Date;
}