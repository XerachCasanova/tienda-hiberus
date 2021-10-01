import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
        path: 'pedidos', 
        loadChildren: () => import('../pedido-form-public/pedido-form-public.module').then(m => m.PedidoFormPublicModule) 
        
      }
    ]
     
  }
  
 
  
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicShellRoutingModule {}
