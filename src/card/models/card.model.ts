import { CommentModel } from './comment.model';

export interface CardModel {
  board_id: string;
  title: string;
  content?: string;
  list_id: string;
  created_by: string;
  created_at?: number;
  updated_at?: number;
  start_date?: Date;
  due_date?: Date;
  completion_date?: Date;
  comments?: Array<CommentModel>;
  index?: number;
  color: string;
  priority?: string;
  assignees?: Array<string>;
  _id?: string;
  __v?: number;
}
