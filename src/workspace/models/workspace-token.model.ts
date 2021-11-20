export interface WorkspaceTokenModel {
  token: string;
  expire: number;
  email: string;
  workspace_id: string;
  user_id: string;
  _id?: string;
  __v?: number;
}
