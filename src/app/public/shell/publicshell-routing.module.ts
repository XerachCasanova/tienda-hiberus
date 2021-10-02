import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosListComponent } from 'src/app/pedidos/pedidos-list/pedidos-list.component';
import { PublicshellComponent } from './publicshell.component';

const routes: Routes = [
 
  {
    path: '', 
    component: PublicshellComponent,
    children: [
      {
        path: '', 
        loadChildren: () => import('../productos/productos.module').then(m => m.ProductosModule)
        
      },
      {
        path: 'productos', 
        loadChildren: () => import('../productos/productos.module').then(m => m.ProductosModule) 
        
      },
      {
        path: 'pedido', 
        loadChildren: () => import('../pedido-form-public/pedido-form-public.module').then(m => m.PedidoFormPublicModule) 
        
      },
      {
        path: 'pedidos', 
        component: PedidosListComponent
        
      }
      
    ]
     
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicShellRoutingModule {}
