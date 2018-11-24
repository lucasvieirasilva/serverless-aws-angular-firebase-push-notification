import { Injectable } from '@angular/core';
import { AWSHttpClient } from '../aws/aws-http-client';
import { Observable } from 'rxjs';
import { IUser } from './types';

@Injectable()
export class UserService {

    constructor(private awsHttpClient: AWSHttpClient) {

    }

    public createUser(username: string): Observable<IUser> {
        return this.awsHttpClient.post('/user', { username });
    }
}
