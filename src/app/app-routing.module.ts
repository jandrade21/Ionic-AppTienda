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

// const isadmin =  'sLT7GQUso4XeLz4xdnqx2yVajRf1'
// const onlyAdmin = () => map ( (user:any) => !!user && ('sLT7GQUso4XeLz4xdnqx2yVajRf1' === user.uid));
const routes: Routes = [
  {path: 'home',component:HomeComponent},
  {path: 'set-productos',component:SetProductosComponent}, //...canActivate(onlyAdmin )},
  {path: 'pedidos',component:PedidosComponent},
  {path: 'mis-pedidos',component:MispedidosComponent},
  {path: 'carrito',component:CarritoComponent},
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
