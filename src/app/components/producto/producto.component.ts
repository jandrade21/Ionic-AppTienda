import { CarritoService } from './../../services/carrito.service';
import { CarritoComponent } from './../../pages/carrito/carrito.component';
import { Producto } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;
  productos : Producto[]=[];
  
  constructor( public carritoService:CarritoService,
               public toastController: ToastController) { }

  ngOnInit() {}
  async presentToast(mensaje:string, color:string, icono:string, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: mensaje,
      cssClass:'normal',
      duration: 2000,
      color:color,
      icon: icono,
      position:position
    });
    toast.present();
  }
  addCarrito(){
    this.carritoService.addProducto(this.producto)
    this.presentToast('Se agrego al carrito','success','checkmark','top')
  }

}
