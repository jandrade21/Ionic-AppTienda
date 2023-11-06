import { Pedido } from 'src/app/models';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirebaseauthService } from './../../services/firebaseauth.service';
import { FirestorageService } from './../../services/firestorage.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit {

  nuevosSubscriber:Subscription;
  entregadoSubscriber:Subscription;
  pedidos: Pedido[]= [];
  
  constructor(public menucontroller:MenuController,
              public firestoreService:FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }
  ngOnDestroy() {
    if(this.nuevosSubscriber){
      this.nuevosSubscriber.unsubscribe();
    }
    if(this.entregadoSubscriber){
      this.entregadoSubscriber.unsubscribe();
    }
  }

  openMenu(){
    this.menucontroller.toggle('custom')
  }
  changeSegment(evento:any){
    console.log('segment',evento.detail.value);
    const opc = evento.detail.value;
    if (opc === 'entregado'){
      this.getPedidosEntregados();
    }
    if (opc === 'nuevos'){
      this.getPedidosNuevos();
    }
  }
  async getPedidosNuevos(){
    console.log('pedidosentregaos')
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.nuevosSubscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'enviado').subscribe( res =>{
      if(res.length){
        this.pedidos = res;
      }
    })
  }
  async getPedidosEntregados(){
    console.log('pedidosnuevos');
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.entregadoSubscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe( res =>{
      if(res.length){
        this.pedidos = res;
      }
    })
  }
}
