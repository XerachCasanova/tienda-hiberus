import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosListComponent } from './pedidos-list/pedidos-list.component';

const routes: Routes = [{ path: '', component: PedidosListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosRoutingModule {}
