import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-publicshell',
  templateUrl: './publicshell.component.html',
  styleUrls: ['./publicshell.component.css']
})
export class PublicshellComponent implements OnInit {
  
  nProductosBudget:number
  carrito:Producto[];
  constructor() { 

    this.carrito = [];

    this.nProductosBudget = 0;
  }

  ngOnInit(): void {
  }

  abrirFormProductosDialog(){
    console.log(this.carrito);
  }

  onActivate(carrito:any) {
    
    console.log(carrito);
 
    carrito.carritoToSend.subscribe((data:any) => {
      this.nProductosBudget = data.length
   })

 }

}
