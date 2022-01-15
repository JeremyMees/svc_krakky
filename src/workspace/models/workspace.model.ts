import { MemberModel } from './member.model';

export interface WorkspaceModel {
  created_by: string;
  workspace: string;
  workspace_id?: string;
  color: string;
  bg_color: string;
  team: Array<MemberModel>;
  _id?: string;
  __v?: number;
}
