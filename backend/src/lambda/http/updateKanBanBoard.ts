import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { KanbanBoardRequest } from '../../requests/KanbanBoardRequest';
import { updateKanbanBoard } from '../../businessLogic/kanbanBoards';

const logger = createLogger('updateKanbanBoard');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const boardId = event.pathParameters.boardId;
    const updatedBoardReq: KanbanBoardRequest = JSON.parse(event.body);

    try {
        const updatedBoard = await updateKanbanBoard(boardId, updatedBoardReq, event);
        logger.info('Successfully udpated kanban board.');
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
        logger.error('Unable to update board, board to be updated could not be found.');
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
