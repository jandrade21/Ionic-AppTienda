import { FirebaseauthService } from './services/firebaseauth.service';
import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Platform } from '@ionic/angular';
import { timeStamp } from 'console';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  admin = false;
  
  constructor( 
    private firebaseauthService:FirebaseauthService,
    private platform:Platform,
    ) {
      this.initializeApp();
    }

  initializeApp(){
    this.platform.ready().then(()=>{
    this.getUid();
    })
  }

  getUid(){
    this.firebaseauthService.stateAuth().subscribe( res =>{
      if (res !== null){
        if (res.uid === 'sLT7GQUso4XeLz4xdnqx2yVajRf1'){
          this.admin = true;
        } else {
          this.admin = false;
        }
      }else {
        this.admin = false;
      }
    })
  }
}