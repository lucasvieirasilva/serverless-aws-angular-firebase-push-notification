import { Injectable } from '@angular/core';
import * as ApiGatewayFactory from 'aws-api-gateway-client';
import { CognitoAuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';
import { Observable, defer } from 'rxjs';
import { ICredentials } from '@aws-amplify/core';
import { IPathVariables, IQueryStringParams } from './types';

@Injectable()
export class AWSHttpClient {

    constructor(private auth: CognitoAuthService) {
    }

    public get(path: string, pathVariables?: IPathVariables, queryParams?: IQueryStringParams): Observable<any> {
        return this.request(path, 'GET', pathVariables, queryParams);
    }

    public post(path: string, pathVariables?: IPathVariables, queryParams?: IQueryStringParams, body?: any): Observable<any> {
        return this.request(path, 'POST', pathVariables, queryParams, body ? body : {});
    }

    public put(path: string, pathVariables?: IPathVariables, queryParams?: IQueryStringParams, body?: any): Observable<any> {
        return this.request(path, 'PUT', pathVariables, queryParams, body ? body : {});
    }

    public delete(path: string, pathVariables?: IPathVariables, queryParams?: IQueryStringParams) {
        return this.request(path, 'DELETE', pathVariables, queryParams);
    }

    private request(path: string, method: string, pathVariables?: IPathVariables,
        queryParams?: IQueryStringParams, body?: any): Observable<any> {

        return defer(async () => {
            const credentials = await this.auth.getAwsCredentials();
            const client = this.getApiGatewayClient(credentials);
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
