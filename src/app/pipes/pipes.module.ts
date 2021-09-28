import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcotarStringPipe } from './acotar-string.pipe';



@NgModule({
  declarations: [AcotarStringPipe],
  imports: [
    CommonModule
  ],
  exports: [
    AcotarStringPipe
  ]
})
export class PipesModule { }
