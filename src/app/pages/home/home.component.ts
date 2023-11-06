import { Producto } from './../../models';
import { FirestoreService } from './../../services/firestore.service';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private path = 'Productos/';
  productos : Producto[]=[];

  constructor(public menucontroller:MenuController, public firestoreService:FirestoreService) { 
    this.loadProducto();
  }

  ngOnInit() {}

  openMenu(){
    this.menucontroller.toggle('custom')
  }
  loadProducto(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe( res =>{
      console.log(res);
      this.productos = res
    } )
  }
}
