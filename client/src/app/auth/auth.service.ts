import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { tap, catchError, flatMap } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { ICredentials } from '@aws-amplify/core';
import { CognitoIdentityCredentials } from 'aws-sdk/lib/core';
import { AuthService } from 'angular-6-social-login';

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
        const { email, token, expiresIn } = userData;
        const expires_at = expiresIn * 1000 + new Date().getTime();
        const user = { name: email };

        return from(Auth.federatedSignIn(provider, { token, expires_at }, user))
            .pipe(
                tap((result: CognitoIdentityCredentials) => {
                    const { accessKeyId, secretAccessKey, sessionToken, identityId } = result;
                    this.credentails = { accessKeyId, secretAccessKey, sessionToken, identityId, authenticated: true };
                    this.loggedIn.next(true);
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
                result => {
                    this.loggedIn.next(false);
                    this.router.navigate(['/login']);
                },
                error => console.log(error)
            );
    }
}
