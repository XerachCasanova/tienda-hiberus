import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosRoutingModule } from './pedidos-routing.module';
import { PedidosListComponent } from './pedidos-list/pedidos-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PedidosFormComponent } from './pedidos-form/pedidos-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { MomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    PedidosListComponent,
    PedidosFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PedidosRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    CurrencyMaskModule,
    MomentDateModule,

    
  ],

})
export class PedidosModule { }
