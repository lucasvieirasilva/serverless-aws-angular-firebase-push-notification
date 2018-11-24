import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MessagingService } from './fcm/messaging.service';
import { AsyncPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import { CognitoAuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angular-6-social-login';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { SigninComponent } from './signin/signin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AWSHttpClient } from './aws/aws-http-client';
import { UserService } from './user/user.service';

export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(environment.social.FB)
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(environment.social.Google)
      }
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SocialLoginModule,
    AngularFireMessagingModule,
    FormsModule,
    ReactiveFormsModule,
    AmplifyAngularModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [
    MessagingService,
    AsyncPipe,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    AmplifyService,
    CognitoAuthService,
    UserService,
    AWSHttpClient,
    AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
