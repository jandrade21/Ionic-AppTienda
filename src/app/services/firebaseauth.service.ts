import { Cliente } from './../models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {
  datoscliente:Cliente;

  constructor(public auth: AngularFireAuth,
              private firestoreService:FirestoreService) {
    this.getUid();
    this.stateUser();
   }

  stateUser(){
    this.stateAuth().subscribe(res =>{
      console.log(res);
      if (res !== null){
        this.getInfoUser();
      }
    });
  }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  logout() {
    return this.auth.signOut();
  }
  registrar(email: string, password: string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }
  async getUid(){
    const user = await this.auth.currentUser;
    if (user === null){
      return null;
    } else{
      return user.uid;
    }
  }
  stateAuth(){
    return this.auth.authState;
  }
  async getInfoUser(){
    const uid = await this.getUid();
    const path = 'Clientes';
    this.firestoreService.getDoc<Cliente>(path,uid).subscribe(res =>{
      if (res !== undefined){
        this.datoscliente = res;
        console.log('datoscliente',this.datoscliente);
      }
    })
  }
}
