import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { AWSHttpClient } from '../aws/aws-http-client';

@Injectable()
export class MessagingService {

  token: string;
  subscribed = false;
  allowed = false;
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging, private awsHttpClient: AWSHttpClient) { }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.token = token;
        this.awsHttpClient.post('/user/device', { token }).subscribe(result => this.subscribed = true);
        this.allowed = true;
      },
      (err) => {
        this.allowed = false;
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        this.currentMessage.next(payload.data.default);
      });
  }
}
