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
        
      }
    ]
     
  }
  
 
  
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicShellRoutingModule {}
