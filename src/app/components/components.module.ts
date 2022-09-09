import { ItemcarritoComponent } from './itemcarrito/itemcarrito.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProductoComponent } from './producto/producto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    ProductoComponent,
    ItemcarritoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ],
  exports:[
    ProductoComponent,
    ItemcarritoComponent,
  ]
})
export class ComponentsModule { }
