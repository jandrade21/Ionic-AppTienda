import { ReservaConfirmadaComponent } from './reserva-confirmada/reserva-confirmada.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ReservaComponent } from './reserva/reserva.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { MispedidosComponent } from './mispedidos/mispedidos.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ComponentsModule } from './../components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil/perfil.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MisReservasComponent } from './mis-reservas/mis-reservas.component';



@NgModule({
  declarations: [
    HomeComponent,
    PerfilComponent,
    CarritoComponent,
    MispedidosComponent,
    PedidosComponent,
    ReservaComponent,
    CalendarComponent, 
    ReservaConfirmadaComponent,
    MisReservasComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
