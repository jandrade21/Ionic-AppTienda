import { FirebaseauthService } from './../../services/firebaseauth.service';
import { CarritoService } from './../../services/carrito.service';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pedido } from 'src/app/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent implements OnInit, OnDestroy {

  pedido:Pedido;
  carritoSubscriber:Subscription;
  total: number;
  cantidad:number;


  constructor(public menucontroller:MenuController, 
              public firestoreService:FirestoreService,
              public carritoService:CarritoService,
              public firebaseauthService:FirebaseauthService) {
    
    this.initCarrito();
    this.loadPedido();
   }

  ngOnInit() {}
  ngOnDestroy() {
      console.log('carrito componente')
    if(this.carritoSubscriber){
      this.carritoSubscriber.unsubscribe();
    }
    }

  openMenu(){
    this.menucontroller.toggle('custom')
  }
  loadPedido(){
    this.carritoSubscriber = this.carritoService.getCarrito().subscribe(res =>{
      this.pedido = res;
      this.getTotal();
      this.getCantidad();
    })
  }
  initCarrito(){
    this.pedido = {
      id:'',
      cliente:null,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
  }
  getTotal(){
    this.total = 0;
    this.pedido.productos.forEach(producto =>{
      this.total = (producto.producto.precioReducido) * producto.cantidad + this.total;
    })
  }
  getCantidad(){
    this.cantidad = 0;
    this.pedido.productos.forEach(producto =>{
      this.cantidad = producto.cantidad + this.cantidad;
    })
  }
  async pedir(){
    if(!this.pedido.productos.length){
      console.log('añade items al carrito');
      return;
    }
    this.pedido.fecha = new Date();
    this.pedido.precioTotal = this.total; 
    this.pedido.id = this.firestoreService.getId();
    const uid = await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    console.log('pedir',this.pedido, uid, path);
    
    this.firestoreService.createDoc(this.pedido, path, this.pedido.id).then(() =>{
      console.log('guardado con exito');
      this.carritoService.clearCarrito();
    })
  }
}
