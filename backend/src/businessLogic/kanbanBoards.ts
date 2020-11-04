import { APIGatewayProxyEvent } from "aws-lambda";
import { KanbanBoardAccess } from "../dataLayer/kanbanBoardAccess";
import { getUserId } from "../lambda/utils";
import { KanBanBoard } from "../models/KanBanBoard";
import { KanbanBoardRequest } from "../requests/KanbanBoardRequest";
import { createLogger } from "../utils/logger";
import * as uuid from 'uuid';

const logger = createLogger('blKanBanBoards');
const kanbanBoardAccess = new KanbanBoardAccess();

export async function getKanBanBoards(event: APIGatewayProxyEvent): Promise<KanBanBoard[]> {
    logger.info('businessLogic: get all KanBan boards.');
    const userId = getUserId(event);
    return await kanbanBoardAccess.getKanBanBoardsForUser(userId);
}

export async function createKanbanBoard(newBoard: KanbanBoardRequest, event: APIGatewayProxyEvent): Promise<KanBanBoard> {
    logger.info('businessLogic: create KanBan board:', newBoard.title);
    const boardId = uuid.v4();
    const newItem: KanBanBoard = {
        userId: getUserId(event),
        boardId: boardId,
        createdAt: new Date().toISOString(),
        ...newBoard
    };
    return await kanbanBoardAccess.createKanbanBoard(newItem);
}

export async function updateKanbanBoard(boardId: string, updatedBoardReq: KanbanBoardRequest, event: APIGatewayProxyEvent): Promise<KanBanBoard> {
    logger.info('businessLogic: update item', updatedBoardReq);
    const userId = getUserId(event);
    return await kanbanBoardAccess.updateKanbanBoard(boardId, userId, updatedBoardReq);
}

export async function deleteKanbanBoard(boardId: string, event: APIGatewayProxyEvent): Promise<void> {
    logger.info('businessLogic: delete board', boardId);
    const userId = getUserId(event);
    return await kanbanBoardAccess.deleteKanbanBoard(boardId, userId);
}