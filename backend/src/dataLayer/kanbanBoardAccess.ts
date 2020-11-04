import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { KanBanBoard } from '../models/KanBanBoard';
import { KanbanBoardRequest } from '../requests/KanbanBoardRequest';
import { createLogger } from '../utils/logger'

const logger = createLogger('dlKanBanAccess');

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const kanbanBoardTable = process.env.KANBAN_TABLE;

export class KanbanBoardAccess {

    private docClient: DocumentClient;

    constructor() {
        this.docClient = new XAWS.DynamoDB.DocumentClient();
    }

    async getKanBanBoardsForUser(userId: string): Promise<KanBanBoard[]> {
        logger.info('dataLayer: get all kan ban boards for user:', userId);
        const result = await this.docClient.query({
            TableName: kanbanBoardTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const items = result.Items;
        logger.info('dataLayer: User', userId, 'has', items.length, 'items');
        return items as KanBanBoard[];
    }

    async createKanbanBoard(newBoard: KanBanBoard): Promise<KanBanBoard> {
        logger.info('dataLayer: create kanban board', newBoard.title);
        await this.docClient.put({
            TableName: kanbanBoardTable,
            Item: newBoard
        }).promise();
        return newBoard;
    }

    async updateKanbanBoard(boardId: string, userId: string, updatedBoardReq: KanbanBoardRequest): Promise<KanBanBoard> {
        logger.info('dataLayer: update kanban board', boardId);
        const board: KanBanBoard = await this.getBoard(boardId, userId);

        await this.docClient.update({
            TableName: kanbanBoardTable,
            Key: {
                userId,
                boardId
            },
            ConditionExpression: 'boardId = :boardId',
            UpdateExpression: 'set #title = :title',
            ExpressionAttributeValues: {
                ':boardId': board.boardId,
                ':title': updatedBoardReq.title
            },
            ExpressionAttributeNames: {
                '#title': 'title'
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        board.title = updatedBoardReq.title;
        return board;
    }

    async deleteKanbanBoard(boardId: string, userId: string): Promise<void> {
        logger.info('dataLayer: Delete kanban board', boardId, 'for user', userId);

        await this.docClient.delete({
            TableName: kanbanBoardTable,
            Key: {
                userId,
                boardId
            },
            ConditionExpression: 'boardId = :boardId',
            ExpressionAttributeValues: {
                ':boardId': boardId
            }
        }).promise();
    }

    private async getBoard(boardId: string, userId: string): Promise<KanBanBoard> {
        logger.info('dataLayer: get board by id and user:', boardId, userId);
        const board = await this.docClient.query({
            TableName: kanbanBoardTable,
            KeyConditionExpression: 'userId = :userId and boardId = :boardId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':boardId': boardId
            },
            Limit: 1
        }).promise();
        const item = board.Items[0]
        if (item === undefined) {
            logger.error('dataLayer: board with id', boardId, 'does not exist for user', userId);
            throw new Error();
        }
        return item as KanBanBoard;
    }
}