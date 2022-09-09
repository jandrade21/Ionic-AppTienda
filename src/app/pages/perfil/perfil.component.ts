import { FirestoreService } from './../../services/firestore.service';
import { FirestorageService } from './../../services/firestorage.service';
import { FirebaseauthService } from './../../services/firebaseauth.service';
import { Cliente } from './../../models';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  cliente: Cliente = {
    uid: '',
    email: '',
    nombre:'',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null
  }
  newFile: any;
  uid = '';
  subscriberUserInfo: Subscription;
  ingresarEnable= false;
  constructor(
    public menucontroller:MenuController, 
    public firebaseauthservice:FirebaseauthService,
    public firestoreService:FirestoreService,
    public firestorageService: FirestorageService,
    ) {
      
      this.firebaseauthservice.stateAuth().subscribe(res =>{
       
         if (res !== null){
           this.uid = res.uid;
           this.getUserInfo(this.uid);
         } else{
          this.initCliente();
         }
      });
     }

  async ngOnInit() {
    const uid = await this.firebaseauthservice.getUid();
    console.log(uid);
  }

  initCliente(){
    this.uid = '';
    this.cliente ={
      uid: '',
      email: '',
      nombre:'',
      celular: '',
      foto: '',
      referencia: '',
      ubicacion: null
    }
  }

  openMenu(){
    this.menucontroller.toggle('custom')
  }
  async newImageUpload(event: any){
    if(event.target.files && event.target.files[0]){
     this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image)=>{
        this.cliente.foto = image.target.result as string;
     });
      reader.readAsDataURL(event.target.files[0]);
    }
 }
 async registrarse(){
  const  credenciales ={
    email: this.cliente.email,
    password: this.cliente.celular,
  };
  const res = await this.firebaseauthservice.registrar(credenciales.email, credenciales.password).catch( err =>{
    console.log('error->', err)
  });
  const uid = await this.firebaseauthservice.getUid();
  this.cliente.uid = uid;
  this.guardarUser();  
}
async guardarUser(){
  const path = 'Clientes';
  const name = this.cliente.nombre;
  if (this.newFile !== undefined){
  const res = await this.firestorageService.uploadImage(this.newFile, path, name);
  this.cliente.foto = res;
  }
  this.firestoreService.createDoc(this.cliente, path, this.cliente.uid).then(res=>{
    console.log('guardado con exito')
  }).catch(error=>{
  });
}

  async salir(){
    //const uid = await this.firebaseauthservice.getUid();
    //console.log(uid);
    this.firebaseauthservice.logout();
    this.subscriberUserInfo.unsubscribe();
  }
  getUserInfo(uid: string){
    const path ='Clientes';
    this.subscriberUserInfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe(res =>{
      if(res){
        this.cliente = res;
        console.log(res)
      }
    });
  }
  ingresar(){
    const  credenciales ={
      email: this.cliente.email,
      password: this.cliente.celular,
    }
    this.firebaseauthservice.login(credenciales.email, credenciales.password).then(res =>{
      console.log('ingreso con exito')
    })
  }
}
