import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Pedido, PedidoDetalle } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { ProductosService } from 'src/app/productos/productos.service';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //carritoToSend envía el carrito al componente que contiene el carrito
  @Output() carritoToSend: EventEmitter<any> = new EventEmitter();

  obs!: Observable<any>;
  listadoProductos!: Producto[];

  dataSource: MatTableDataSource<Producto> = new MatTableDataSource<Producto>(this.listadoProductos);

  carrito: PedidoDetalle[];

  constructor(

    private productosService: ProductosService) { 

      this.carrito = [];

  }

 
  listarProductos() {

    //recibimos el listado de productos de la base de datos y rellenamos el datasource
    this.productosService.getProductos().subscribe((data:any) => {
      this.listadoProductos = data
      this.dataSource = new MatTableDataSource<Producto>(this.listadoProductos)
      this.dataSource.paginator = this.paginator;
      this.obs = this.dataSource.connect();
    });
  }

  ngOnInit(): void {

    this.listarProductos();
    
  }

  addToCarrito(producto:Producto){

    //Añadimos un producto al array con cero cantidades, ya que el componente que maneja el carrito
    //se hará cargo de recalcular a partir de las veces que se cada producto.
    this.carrito.push({
      cantidad: 0,
      descuento: 0,
      refProducto: producto.referencia,
      tituloProducto: producto.titulo,
      precioUnitario: producto.precio,
      precioTotal: producto.precio,
    });

    //Enviamos el carrito al componente que contiene toda su lógica.
    this.carritoToSend.emit(this.carrito);
  }

  ngOnDestroy() {
    if (this.dataSource) { 
      this.dataSource.disconnect(); 
    }
  }

 
}
