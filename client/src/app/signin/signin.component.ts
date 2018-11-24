import { Component, OnInit } from '@angular/core';
import {
    FacebookLoginProvider,
    GoogleLoginProvider
} from 'angular-6-social-login';
import { CognitoAuthService } from '../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: CognitoAuthService) { }

    public loginForm: FormGroup;

    public async socialSignIn(socialPlatform: string) {
        let socialPlatformProvider;
        if (socialPlatform === 'facebook') {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if (socialPlatform === 'google') {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        }

        const userData = await this.auth.socialService.signIn(socialPlatformProvider);

        this.auth.federatedSignIn(socialPlatform, userData).subscribe(
            result => {
                this.router.navigate(['/']);
            },
            error => {
                console.log(error);
            });
    }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.loginForm = this.fb.group({
            'email': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    onSubmitLogin(value: any) {
        const email = value.email, password = value.password;
        this.auth.signIn(email, password)
            .subscribe(
                result => {
                    this.router.navigate(['/']);
                },
                error => {
                    console.log(error);
                });
    }
}
