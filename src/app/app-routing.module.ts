import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/auth.guard';


const routes: Routes = [
  
  {
    path: '',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'usuarios',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
  },

  {
    path: 'categorias',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./categorias/categorias.module').then((m) => m.CategoriasModule),
  },

  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./productos/productos.module').then((m) => m.ProductosModule),
  },

  {
    path: 'pedidos',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pedidos/pedidos.module').then((m) => m.PedidosModule),
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
