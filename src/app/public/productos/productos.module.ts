import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  declarations: [
    ProductosComponent,
    
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatExpansionModule,
    PipesModule,
  ]
})
export class ProductosModule { }
