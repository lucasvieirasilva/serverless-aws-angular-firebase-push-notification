import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagingService } from './messaging.service';
import { CognitoAuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  message;
  subscription: Subscription;
  public loggedIn: boolean;

  constructor(private messagingService: MessagingService, public auth: CognitoAuthService) { }

  ngOnInit() {
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    this.subscription = this.auth.isAuthenticated()
      .subscribe(result => {
        this.loggedIn = result;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClickLogout() {
    this.auth.signOut();
  }
}
