import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { KanbanBoardItemRequest } from '../../requests/KanbanBoardItemRequest';
import { updateKanbanBoardItem } from '../../businessLogic/kanbanBoardItems';

const logger = createLogger('updateKanbanBoardItem');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const itemId = event.pathParameters.itemId;
    const boardId = event.pathParameters.boardId;
    const updatedItemReq: KanbanBoardItemRequest = JSON.parse(event.body);

    try {
        const updatedBoard = await updateKanbanBoardItem(boardId, itemId, updatedItemReq);
        logger.info('Successfully udpated kanban item.');
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                item: updatedBoard
            })
        }
    }
    catch (e) {
        logger.error('Unable to update item, item to be updated could not be found.');
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                'error': 'Entity not found'
            })
        }
    }
}
