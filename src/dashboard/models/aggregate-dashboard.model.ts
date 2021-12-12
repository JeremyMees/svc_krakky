import { MemberModel } from 'src/workspace/models/member.model';
import { CardModel } from '../../card/models/card.model';
import { ListModel } from '../../list/models/list.model';

export interface AggregateDashboardModel {
  _id?: string;
  __v?: number;
  created_by: string;
  title: string;
  board_id: string;
  workspace: string;
  lists: Array<ListModel>;
  cards: Array<CardModel>;
  team: Array<MemberModel>;
  private: boolean;
}
