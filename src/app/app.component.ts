import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//  import { ZoomMtg } from '@zoomus/websdk';
// //import { ZoomMtg } from 'zoomus-jssdk';
import { ZoomMtg } from '@zoomus/websdk';

//  ZoomMtg.setZoomJSLib('https://source.zoom.us/1.7.5/lib', '/av');
// declare var ZoomMtg:any;

 ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.1/lib", "/av")
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // setup your signature endpoint here: https://github.com/zoom/websdk-sample-signature-node.js
  signatureEndpoint = 'https://sheltered-wave-26127.herokuapp.com/'
  //signatureEndpoint = 'http://localhost:3089/'
 name="";
  apiKey = 'QE2SZLhBQHK_PpP25tIzfw'
  meetingNumber = '77077812872'
  
  role = 0
  leaveUrl = 'https://oceanacademy.co.in'
  userName = 'Angular'
  userEmail = ''
  
  passWord = 'L1FYdzVWd3NhS3Z6L0hBZXIrbTM4QT09'
  
  constructor(private route: ActivatedRoute,public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.meetingNumber = params['meetingNumber'];
      this.userName=params['username'];
      this.passWord=params['password'];
      console.log(this.meetingNumber);
      console.log(this.userName);
      console.log(this.passWord);
    });
  }

  getSignature() {
    this.httpClient.post(this.signatureEndpoint, {
	    meetingNumber: this.meetingNumber,
	    role: this.role
    }).toPromise().then((data: any) => {
      if(data.signature) {
        console.log(data.signature)
        console.log(this.meetingNumber)
        this.startMeeting(data.signature)
      } else {
        console.log(data)
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      isSupportAV: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(this.meetingNumber)
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
