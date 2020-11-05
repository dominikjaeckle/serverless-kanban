import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { KanbanBoardItemRequest } from '../../requests/KanbanBoardItemRequest'; 
import { createKanbanBoardItem } from '../../businessLogic/kanbanBoardItems';

const logger = createLogger('createKanBanBoardItem')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const newBoardItem: KanbanBoardItemRequest = JSON.parse(event.body);
    const boardId = event.pathParameters.boardId;
    const newKanbanItem = await createKanbanBoardItem(boardId, newBoardItem);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newKanbanItem
        })
    }
}
