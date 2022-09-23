import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Cliente } from './models';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  uid = '';
  admin = false;
  cliente: Cliente = {
    uid: '',
    email: '',
    nombre:'',
    apellido: '',
    password: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null
  }

  
  constructor( 
    private firebaseauthService:FirebaseauthService,
    private platform:Platform,
    private firestoreService:FirestoreService,
    ) {
      this.initializeApp();
      this.firebaseauthService.stateAuth().subscribe(res =>{
       
        if (res !== null){
          this.uid = res.uid;
          this.getUserInfo(this.uid);
        } else{
         this.initCliente();
        }
     });
    }

  initializeApp(){
    this.platform.ready().then(()=>{
    this.getUid();
    this.getUserInfo;

    })
  }
  initCliente(){
    this.uid = '';
    this.cliente ={
      uid: '',
      email: '',
      nombre:'',
      apellido:'',
      password:'',
      celular: '',
      foto: '',
      referencia: '',
      ubicacion: null
    }
  }

  getUid(){
    this.firebaseauthService.stateAuth().subscribe( res =>{
      if (res !== null){
        if (res.uid === 'sLT7GQUso4XeLz4xdnqx2yVajRf1') {
          this.admin = true;
        } else {
          this.admin = false;
        }
      }else {
        this.admin = false;
      }
    });
  }
  getUserInfo(uid: string){
    const path ='Clientes';
    this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res =>{
      if(res){
        this.cliente = res;
        console.log(res)
      }
    });
  }
}