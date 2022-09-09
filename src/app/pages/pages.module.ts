import { MispedidosComponent } from './mispedidos/mispedidos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ComponentsModule } from './../components/components.module';
import { FormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil/perfil.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    CarritoComponent,
    MispedidosComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
  ]
})
export class PagesModule { }
