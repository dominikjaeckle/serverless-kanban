import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { createLogger } from '../../utils/logger';
import { KanBanBoardItem } from '../../models/KanBanBoardItem';
import { getKanbanBoardItems } from '../../businessLogic/kanbanBoardItems';

const logger = createLogger('getKanBanBoards');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event:', event);
    const kanbanboardItems: KanBanBoardItem[] = await getKanbanBoardItems(event.pathParameters.boardId);
    
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: kanbanboardItems
        })
    };
}