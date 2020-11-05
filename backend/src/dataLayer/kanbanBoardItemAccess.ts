import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { KanBanBoardItem } from '../models/KanBanBoardItem';
import { KanbanBoardItemRequest } from '../requests/KanbanBoardItemRequest';
import { createLogger } from '../utils/logger'

const logger = createLogger('dlKanBanItemAccess');

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

const kanbanBoardItemTable = process.env.KANBANITEM_TABLE;
const kanbanBoardItemIndex = process.env.KANBANITEM_INDEX;

const s3Bucket = process.env.S3_BUCKET;
const expiration = Number(process.env.SIGNED_URL_EXPIRATION);

export class KanbanBoardItemAccess {

    private docClient: DocumentClient;
    private s3Client;

    constructor() {
        this.docClient = new XAWS.DynamoDB.DocumentClient();
        this.s3Client = new AWS.S3({ 'signatureVersion': 'v4' });
    }

    async getKanbanBoardItems(boardId: string): Promise<KanBanBoardItem[]> {
        logger.info('dataLayer: Get all kanban items for board: ' + boardId);
        const result = await this.docClient.query({
            TableName: kanbanBoardItemTable,
            KeyConditionExpression: 'boardId = :boardId',
            ExpressionAttributeValues: {
                ':boardId': boardId
            }
        }).promise();

        const items = result.Items;
        logger.info('dataLayer: Board ' + boardId + ' has ' + items.length + ' items.');
        return items as KanBanBoardItem[];
    }

    async createKanbanBoardItem(newItem: KanBanBoardItem): Promise<KanBanBoardItem> {
        logger.info('dataLayer: create kanban item' + newItem.itemId);
        await this.docClient.put({
            TableName: kanbanBoardItemTable,
            Item: newItem
        }).promise();
        return newItem;
    }

    async updateKanbanBoardItem(boardId: string, itemId: string, updatedItemReq: KanbanBoardItemRequest): Promise<KanBanBoardItem> {
        logger.info('dataLayer: update kanban item', boardId);
        const boardItem: KanBanBoardItem = await this.getBoardItem(boardId, itemId);
        logger.info('dataLayer: retrieved item ' + boardItem.itemId);
        const createdAt = boardItem.createdAt;
        await this.docClient.update({
            TableName: kanbanBoardItemTable,
            Key: {
                boardId,
                createdAt
            },
            ConditionExpression: 'itemId = :itemId',
            UpdateExpression: 'set title = :title, description = :description, category = :category',
            ExpressionAttributeValues: {
                ':itemId': itemId,
                ':title': updatedItemReq.title,
                ':description': updatedItemReq.description,
                ':category': updatedItemReq.category
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        return this.getBoardItem(boardId, itemId);;
    }

    async deleteKanbanBoardItem(boardId: string, itemId: string): Promise<void> {
        logger.info('dataLayer: Delete kanban board item ', itemId);
        const item: KanBanBoardItem = await this.getBoardItem(boardId, itemId);

        const createdAt = item.createdAt;
        await this.docClient.delete({
            TableName: kanbanBoardItemTable,
            Key: {
                boardId,
                createdAt
            },
            ConditionExpression: 'itemId = :itemId',
            ExpressionAttributeValues: {
                ':itemId': itemId
            }
        }).promise();
    }

    private async getBoardItem(boardId: string, itemId: string): Promise<KanBanBoardItem> {
        logger.info('dataLayer: for update, get kanban item' + itemId + 'for board' + boardId);
        const boardItem = await this.docClient.query({
            TableName: kanbanBoardItemTable,
            IndexName: kanbanBoardItemIndex,
            KeyConditionExpression: 'boardId = :boardId and itemId = :itemId',
            ExpressionAttributeValues: {
                ':boardId': boardId,
                ':itemId': itemId
            },
            ScanIndexForward: false,
            Limit: 1
        }).promise();

        const item = boardItem.Items[0];
        if (item === undefined) {
            logger.error('dataLayer: item with id', itemId, 'does not exist for board', boardId);
            throw new Error();
        }
        return item as KanBanBoardItem;
    }

    getSignedImgUploadUrl(itemId: string): string {
        logger.info('dataLayer: Requesting signed url from s3 client for kanban item:' + itemId);
        return this.s3Client.getSignedUrl('putObject', {
            Bucket: s3Bucket,
            Key: itemId,
            Expires: expiration
        });
    }
}