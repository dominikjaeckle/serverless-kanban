import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deleteKanbanBoard } from '../../businessLogic/kanbanBoards'

const logger = createLogger('deleteKanbanBoard')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event)
    const boardId = event.pathParameters.boardId
    try {
        await deleteKanbanBoard(boardId, event);
        logger.info('Successfully deleted board item with id:', boardId);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: ''
        }
    }
    catch (e) {
        logger.error('Could not find board to be deleted with id:', boardId);
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
