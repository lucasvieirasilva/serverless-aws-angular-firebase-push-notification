import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as ApiGatewayFactory from 'aws-api-gateway-client';
import { CognitoAuthService } from '../auth/auth.service';
import { AWSHttpClient } from '../aws/aws-http-client';
import { MessagingService } from '../fcm/messaging.service';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: BehaviorSubject<any> = null;
  notificationForm: FormGroup;

  constructor(private awsHttp: AWSHttpClient,
    private messagingService: MessagingService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    this.initForm();
  }

  initForm() {
    this.notificationForm = this.fb.group({
      'message': ['', Validators.required]
    });
  }

  onSubmit(value: any) {
    this.awsHttp.post('/notify', value).subscribe(result => console.log(result));
  }
}
