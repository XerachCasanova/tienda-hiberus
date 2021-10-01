import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoFormPublicComponent } from './pedido-form-public.component';

const routes: Routes = [{ path: '', component: PedidoFormPublicComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoFormPublicRoutingModule { }
