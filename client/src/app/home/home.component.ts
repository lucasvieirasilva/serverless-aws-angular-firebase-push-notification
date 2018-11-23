import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as ApiGatewayFactory from 'aws-api-gateway-client';
import { CognitoAuthService } from '../auth/auth.service';
import { AWSHttpClient } from '../aws/aws-http-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private awsHttp: AWSHttpClient) { }

  ngOnInit() {
  }

  public testApi() {
    this.awsHttp.get('/hello').subscribe(result => console.log(result));
  }

}
