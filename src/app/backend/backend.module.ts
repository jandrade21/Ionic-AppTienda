import { PeluquerosComponent } from './peluqueros/peluqueros.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetProductosComponent } from './set-productos/set-productos.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SetProductosComponent,
    PeluquerosComponent
  ],
  imports: [
    CommonModule, 
    IonicModule,
    FormsModule,
  ]
})
export class BackendModule { }
