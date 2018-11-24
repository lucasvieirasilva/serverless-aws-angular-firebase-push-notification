import { Injectable } from '@angular/core';
import * as ApiGatewayFactory from 'aws-api-gateway-client';
import { CognitoAuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { Observable, defer } from 'rxjs';
import { IPathVariables, IQueryStringParams } from './types';
import { ICredentials } from '@aws-amplify/core';

@Injectable()
export class AWSHttpClient {

    constructor(private auth: CognitoAuthService) {
    }

    get = (path: string, pathVariables?: IPathVariables, queryParams?: IQueryStringParams) =>
        this.request(path, 'GET', pathVariables, queryParams)

    post = (path: string, body?: any, pathVariables?: IPathVariables, queryParams?: IQueryStringParams) =>
        this.request(path, 'POST', pathVariables, queryParams, body ? body : {})

    put = (path: string, body?: any, pathVariables?: IPathVariables, queryParams?: IQueryStringParams) =>
        this.request(path, 'PUT', pathVariables, queryParams, body ? body : {})

    delete = (path: string, pathVariables?: IPathVariables, queryParams?: IQueryStringParams) =>
        this.request(path, 'DELETE', pathVariables, queryParams)

    private request(path: string, method: string, pathVariables?: IPathVariables,
        queryParams?: IQueryStringParams, body?: any): Observable<any> {

        return defer(async () => {
            const client = this.getApiGatewayClient(this.auth.credentails);
            const result = await client.invokeApi(pathVariables, path, method, { queryParams }, body);

            return result ? result.data : result;
        });
    }

    private getApiGatewayClient(credentials: ICredentials) {
        return ApiGatewayFactory.default.newClient({
            invokeUrl: environment.apiGateway.invokeUrl,
            accessKey: credentials.accessKeyId,
            secretKey: credentials.secretAccessKey,
            sessionToken: credentials.sessionToken,
            region: environment.amplify.Auth.region
        });
    }
}
