import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { tap, catchError, flatMap, map } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { ICredentials } from '@aws-amplify/core';
import { CognitoIdentityCredentials } from 'aws-sdk/lib/core';
import { AuthService } from 'angular-6-social-login';
import { FederatedResponse, FederatedUser } from '@aws-amplify/auth/lib/types';

@Injectable()
export class CognitoAuthService {

    public loggedIn: BehaviorSubject<boolean>;
    public credentails: ICredentials;
    public userInfo: any;

    constructor(
        private router: Router,
        public socialService: AuthService,
    ) {
        Amplify.configure(environment.amplify);
        this.loggedIn = new BehaviorSubject<boolean>(false);
    }

    /** signup */
    public signUp(email, password): Observable<any> {
        return from(Auth.signUp({
            username: email,
            password: password,
            attributes: {
                email: email
            }
        }));
    }

    public federatedSignIn(provider, userData): Observable<any> {
        let federaredResponse: FederatedResponse = null;
        let federatedUser: FederatedUser = null;

        switch (provider) {
            case 'facebook':
                federaredResponse = {
                    token: userData.token,
                    expires_at: userData.expiresIn * 1000 + new Date().getTime()
                };
                federatedUser = { name: userData.email };
                break;
            case 'google':
                federaredResponse = {
                    token: userData.idToken,
                    expires_at: 1000 + new Date().getTime()
                };
                federatedUser = { name: userData.email };
                break;
        }

        return from(Auth.federatedSignIn(provider, federaredResponse, federatedUser))
            .pipe(
                map((result: CognitoIdentityCredentials) => {
                    const { accessKeyId, secretAccessKey, sessionToken, identityId } = result;
                    this.credentails = { accessKeyId, secretAccessKey, sessionToken, identityId, authenticated: true };
                    this.loggedIn.next(true);
                    return userData.email;
                })
            );
    }

    /** confirm code */
    public confirmSignUp(email, code): Observable<any> {
        return from(Auth.confirmSignUp(email, code));
    }

    /** signin */
    public signIn(email, password): Observable<any> {
        return from(Auth.signIn(email, password))
            .pipe(
                tap(async () => {
                    this.credentails = await Auth.currentCredentials();
                    this.loggedIn.next(true);
                })
            );
    }

    /** get authenticat state */
    public isAuthenticated(): Observable<boolean> {
        return from(Auth.currentAuthenticatedUser())
            .pipe(
                flatMap(async (result) => {
                    this.userInfo = result;

                    if (!this.credentails) {
                        this.credentails = await Auth.currentCredentials();
                    }

                    this.loggedIn.next(true);
                    return true;
                }),
                catchError(error => {
                    console.error(error);
                    this.loggedIn.next(false);
                    this.userInfo = null;
                    return of(false);
                }));
    }

    /** signout */
    public signOut() {
        from(Auth.signOut())
            .subscribe(
                () => {
                    this.loggedIn.next(false);
                    this.credentails = null;
                    this.userInfo = null;
                    this.router.navigate(['/login']);
                },
                error => console.error(error)
            );
    }
}
