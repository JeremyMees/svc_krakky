import { MemberModel } from './member.model';

export class WorkspaceModel {
  created_by: string;
  workspace: string;
  team: Array<MemberModel>;
  _id?: string;
  __v?: number;
}