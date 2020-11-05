import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { getSignedImgUploadUrl } from '../../businessLogic/kanbanBoardItems';

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const itemId = event.pathParameters.itemId;
    const signedUploadUrl = getSignedImgUploadUrl(itemId);

    logger.info('Successfully created signed URL for todo:', + itemId);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl: signedUploadUrl
        })
    }
}
