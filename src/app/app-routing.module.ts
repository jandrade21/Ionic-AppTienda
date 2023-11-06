import { ReservaConfirmadaComponent } from './pages/reserva-confirmada/reserva-confirmada.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { PeluquerosComponent } from './backend/peluqueros/peluqueros.component';
import { ReservaComponent } from './pages/reserva/reserva.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { MispedidosComponent } from './pages/mispedidos/mispedidos.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
import { HomeComponent } from './pages/home/home.component';
import { map } from 'rxjs/operators';
import { canActivate } from '@angular/fire/auth-guard';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';

// const isadmin =  'sLT7GQUso4XeLz4xdnqx2yVajRf1'
// const onlyAdmin = () => map ( (user:any) => !!user && ('sLT7GQUso4XeLz4xdnqx2yVajRf1' === user.uid));
const routes: Routes = [
  {path: 'home',component:HomeComponent},
  {path: 'set-productos',component:SetProductosComponent}, //...canActivate(onlyAdmin )},
  {path: 'peluqueros',component:PeluquerosComponent},
  {path: 'pedidos',component:PedidosComponent},
  {path: 'mis-pedidos',component:MispedidosComponent},
  {path: 'carrito',component:CarritoComponent},
  {path: 'reserva',component:ReservaComponent},
  {path: 'mis-reservas',component:MisReservasComponent},
  {path: 'reserva-confirmada',component:ReservaConfirmadaComponent},
  {path: 'calendar/:id',component:CalendarComponent},
  {path: 'perfil',component:PerfilComponent},
  {path: 'perfil',component:HomeComponent},
  {
    path: '**',
    redirectTo: 'perfil',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
