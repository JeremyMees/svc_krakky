import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UpdateCardDTO } from 'src/card/dtos/update-card.dto';
import { CardModel } from 'src/card/models/card.model';
import { CardService } from 'src/card/services/card.service';
import { UpdateDashboardDTO } from 'src/dashboard/dtos/update-dashboard.dto';
import { DashboardService } from 'src/dashboard/services/dashboard.service';
import { HttpResponse } from 'src/shared/models/http-response.model';
import { AddTagDTO } from 'src/tag/dtos/add-tag.dto';
import { TagModel } from 'src/tag/models/tag.model';

@Injectable()
export class TagService {
  constructor(
    @Inject(forwardRef(() => DashboardService))
    private dashboardService: DashboardService,
    @Inject(forwardRef(() => CardService))
    private cardService: CardService,
  ) {}

  async addTag(tag: AddTagDTO): Promise<HttpResponse> {
    const { board_id, ...new_tag } = tag;
    const update_card: HttpResponse = await this.updateCard(tag);
    await this.updateDashboard(tag);
    if (update_card.statusCode === 200) {
      return {
        statusCode: 201,
        data: new_tag,
        message: 'Tag successfully added',
      };
    } else {
      return {
        statusCode: 400,
        message: 'Error while adding tag',
      };
    }
  }

  async updateDashboard(tag: AddTagDTO): Promise<HttpResponse> {
    const { card_id, board_id, ...new_tag } = tag;
    return this.dashboardService
      .getDashboards({
        board_id,
      })
      .then(async (res: HttpResponse) => {
        if (res.statusCode === 200) {
          if (res.data[0].recent_tags) {
            const index: number = res.data[0].recent_tags.findIndex(
              (find_tag: TagModel) =>
                find_tag.description === new_tag.description,
            );
            if (index > -1) {
              return {
                statusCode: 400,
                message: 'Tag already exists in recent tags',
              };
            } else {
              res.data[0].recent_tags.unshift(new_tag);
              res.data[0].recent_tags.length > 10
                ? res.data[0].recent_tags.pop()
                : undefined;
            }
          } else {
            res.data[0].recent_tags = [new_tag];
          }
          return await this.dashboardService.updateDashboard({
            board_id,
            recent_tags: res.data[0].recent_tags,
          } as UpdateDashboardDTO);
        } else {
          return {
            statusCode: 400,
            message: 'Error while adding recent tag to dashboards',
          };
        }
      })
      .catch(() => {
        return {
          statusCode: 400,
          message: 'Error while adding recent tag to dashboards',
        };
      });
  }

  async updateCard(tag: AddTagDTO): Promise<HttpResponse> {
    const { card_id, board_id, ...new_tag } = tag;
    const cards: Array<CardModel> = await this.cardService.getCards({
      _id: tag.card_id,
    });
    if (cards[0].tags) {
      cards[0].tags.unshift(new_tag);
      cards[0].tags.length > 3 ? cards[0].tags.pop() : undefined;
    } else {
      cards[0].tags = [new_tag];
    }
    return await this.cardService.updateCard({
      _id: card_id,
      board_id,
      tags: cards[0].tags,
    } as UpdateCardDTO);
  }
}
