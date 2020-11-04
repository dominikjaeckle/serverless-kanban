import { APIGatewayProxyEvent } from "aws-lambda";
import { createLogger } from "../utils/logger";
import * as uuid from 'uuid';
import { KanbanBoardItemAccess } from "../dataLayer/kanbanBoardItemAccess";
import { KanBanBoardItem } from "../models/KanBanBoardItem";
import { KanbanBoardItemRequest } from "../requests/KanbanBoardItemRequest";

const logger = createLogger('blKanBanBoardItems');
const kanbanBoardItemAccess = new KanbanBoardItemAccess();

const s3Bucket = process.env.S3_BUCKET;

export async function getKanbanBoardItems(boardId: string): Promise<KanBanBoardItem[]> {
    logger.info('businessLogic: get items for board ' + boardId);
    return await kanbanBoardItemAccess.getKanbanBoardItems(boardId);
}

export async function createKanbanBoardItem(boardId: string, newBoardItem: KanbanBoardItemRequest): Promise<KanBanBoardItem> {
    logger.info('businessLogic: create new kan ban board item.');
    const itemId = uuid.v4();
    const newItem: KanBanBoardItem = {
        boardId: boardId,
        itemId: itemId,
        createdAt: new Date().toISOString(),
        imageUrl: `https://${s3Bucket}.s3.amazonaws.com/${itemId}`,
        ...newBoardItem
    };
    return await kanbanBoardItemAccess.createKanbanBoardItem(newItem);
}

export async function updateKanbanBoardItem(boardId: string, itemId: string, updatedItemReq: KanbanBoardItemRequest): Promise<KanBanBoardItem> {
    logger.info('businessLogic: update board item ' + itemId);
    return await kanbanBoardItemAccess.updateKanbanBoardItem(boardId, itemId, updatedItemReq);
}
