import { CarritoService } from './../../services/carrito.service';
import { CarritoComponent } from './../../pages/carrito/carrito.component';
import { Producto } from 'src/app/models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
})
export class ProductoComponent implements OnInit {

  @Input() producto: Producto;

  constructor( public carritoService:CarritoService) { }

  ngOnInit() {}

  addCarrito(){
    this.carritoService.addProducto(this.producto);
  }
}
