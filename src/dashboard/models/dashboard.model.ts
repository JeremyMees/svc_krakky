import { MemberModel } from 'src/workspace/models/member.model';

export interface DashboardModel {
  _id?: string;
  __v?: number;
  created_by: string;
  created_at: number;
  updated_at: number;
  title: string;
  board_id: string;
  workspace_id: string;
  team: Array<MemberModel>;
  private: boolean;
  inactive: boolean;
  color: string;
  bg_color: string;
}
