import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { KanbanBoardRequest } from '../../requests/KanbanBoardRequest'
import { createKanbanBoard } from '../../businessLogic/kanbanBoards'

const logger = createLogger('createKanBanBoard')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const newBoard: KanbanBoardRequest = JSON.parse(event.body);
    const newKanban = await createKanbanBoard(newBoard, event);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newKanban
        })
    }
}
