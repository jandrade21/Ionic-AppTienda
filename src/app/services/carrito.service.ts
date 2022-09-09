import { FirestoreService } from 'src/app/services/firestore.service';
import { FirestorageService } from './firestorage.service';
import { FirebaseauthService } from './firebaseauth.service';
import { Pedido, Cliente, ProductoPedido } from './../models';
import { Producto } from 'src/app/models';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private pedido: Pedido;
  pedido$= new Subject<Pedido>();
  path = 'carrito/';
  uid = '';
  cliente: Cliente;
  carritoSubscriber:Subscription;
  clienteSubscriber:Subscription;

  constructor(public firebaseauthservice:FirebaseauthService,
              public firestoreService:FirestoreService, 
              public router:Router) {
    console.log('carrito service')
    this.initCarrito();
    this.firebaseauthservice.stateAuth().subscribe(res =>{
        if (res !== null){
          this.uid = res.uid;
          this.loadCliente();

        }
    });
   } 

  loadCarrito(){
    const path = 'Clientes/' + this.uid + '/' + 'carrito';
    if(this.carritoSubscriber){
      this.carritoSubscriber.unsubscribe();
    }
    this.carritoSubscriber = this.firestoreService.getDoc<Pedido>(path, this.uid).subscribe(res =>{
      if (res){
        this.pedido = res;
        this.pedido$.next(this.pedido);
      } else{
        this.initCarrito();
      }
    })
  }

  initCarrito(){
    this.pedido = {
      id: this.uid,
      cliente: this.cliente,
      productos: [],
      precioTotal: null,
      estado: 'enviado',
      fecha: new Date(),
      valoracion: null,
    };
    this.pedido$.next(this.pedido);
  }
  loadCliente(){
    const path ='Clientes';
    this.clienteSubscriber = this.firestoreService.getDoc<Cliente>(path, this.uid).subscribe(res =>{
      this.cliente = res;
      this.loadCarrito();
      this.clienteSubscriber.unsubscribe();
    })

  }
  getCarrito():Observable<Pedido>{
    setTimeout(() => {
      this.pedido$.next(this.pedido);
    }, 100);
    return this.pedido$.asObservable();
  }

  addProducto(producto:Producto){
    if (this.uid.length){
      const item = this.pedido.productos.find(productoPedido =>{
        return (productoPedido.producto.id === producto.id);
      });
      if(item !== undefined){
        item.cantidad ++;
      } else {
        const add: ProductoPedido={
          cantidad:1,
          producto,
        }
        this.pedido.productos.push(add);
      }
    }else {
      this.router.navigate(['/perfil']);
      return;
    }
    this.pedido$.next(this.pedido);
    console.log(this.pedido)
    const path = 'Clientes/' + this.uid + '/' + this.path;
    this.firestoreService.createDoc(this.pedido, path, this.uid).then(()=>{
      console.log('añadido con exito')
    })
  }

  removeProducto(producto: Producto){
    if (this.uid.length){
      let position =0;
      const item = this.pedido.productos.find((productoPedido, index) =>{
        position = index;
        return (productoPedido.producto.id === producto.id);
      });
      if(item !== undefined){
          item.cantidad --;
          if (item.cantidad === 0){
            this.pedido.productos.splice(position, 1);
          }
        console.log(this.pedido)
        const path = 'Clientes/' + this.uid + '/' + this.path;
        this.firestoreService.createDoc(this.pedido, path, this.uid).then(()=>{
          console.log('añadido con exito')
        });
      }
    }
  }

  realizarPedido(){

  }
  clearCarrito(){
    const path = 'Clientes/' + this.uid + '/' + 'carrito';
    this.firestoreService.deleteDoc(path, this.uid).then(()=>{
      this.initCarrito();
    })
  }
}
