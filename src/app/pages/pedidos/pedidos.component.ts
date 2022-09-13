import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  nuevosSubscriber:Subscription;
  entregadoSubscriber:Subscription;
  pedidos: Pedido[]= [];
  pedidosEntregados: Pedido[]= [];
  nuevos = true;

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
      this.nuevos = false;
      this.getPedidosEntregados();
    }
    if (opc === 'nuevos'){
      this.nuevos = true;
      this.getPedidosNuevos();
    }
  }
  async getPedidosNuevos(){
    console.log('pedidosNuevos')
    const path ='pedidos';
    let startAt = null;
    if (this.pedidos.length){
      startAt = this.pedidos[this.pedidos.length -1].fecha
    }
    this.nuevosSubscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startAt).subscribe( res =>{
      if(res.length){
      res.forEach( pedido =>{
        this.pedidos.push(pedido);
      });
      }
    });
  }
  async getPedidosEntregados(){
    const path ='pedidos';
    let startAt = null;
    if (this.pedidosEntregados.length){
      startAt = this.pedidosEntregados[this.pedidosEntregados.length -1].fecha
    }
    this.nuevosSubscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startAt).subscribe( res =>{
      if(res.length){
      res.forEach( pedido =>{
        this.pedidosEntregados.push(pedido);
      });
      }
    });
  }
  cargarMas(){
    if (this.nuevos){
      this.getPedidosNuevos();
    }else{
      this.getPedidosEntregados();
    }
    
  }
}
