import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoAuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    public signupForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private auth: CognitoAuthService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.signupForm = this.fb.group({
            'email': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    onSubmitSignup(value: any) {
        const email = value.email, password = value.password;
        this.auth.signUp(email, password)
            .subscribe(
                async () => {
                    await this.userService.createUser(email).toPromise();
                },
                error => {
                    console.log(error);
                });
    }
}
