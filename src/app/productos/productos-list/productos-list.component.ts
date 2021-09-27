import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  Inject,
  Optional,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';
import { NotificationsService } from 'src/app/notifications.service';
import { ProductosFormComponent } from '../productos-form/productos-form.component';
import { ProductosService } from '../productos.service';
import { ProductosListDataSource } from './productos-list-datasource';

export const ListPedidosCurrencyMaskConfig: CurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  decimal: ',',
  precision: 2,
  prefix: '',
  suffix: ' €',
  thousands: '.',
}

@Component({
  selector: 'app-productos-list',
  templateUrl: './productos-list.component.html',
  styleUrls: ['./productos-list.component.css'],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: ListPedidosCurrencyMaskConfig,
    },
  ]
})
export class ProductosListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Producto>;

  dataSource: ProductosListDataSource;
  listadoProductos: Producto[];

  producto!: Producto;
  categorias!: Categoria[];

  filterForm: FormGroup;
  filterMode: boolean;
  descripcionOpen: boolean;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'referencia',
    'titulo',
    'descripcion',
    'precio',
    'categoria',
    'acciones',
  ];

  //Inyectamos opcionalmente el dialog para que el componente pueda comportarse de manera distinta
  constructor(
    breakpointObserver: BreakpointObserver,
    private notificationsService: NotificationsService,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<ProductosListComponent>,

    @Optional() @Inject(MAT_DIALOG_DATA) public isDetailDialog: boolean
  ) {
    breakpointObserver.observe(['(max-width: 700px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['titulo', 'precio', 'acciones']
        : [
            'referencia',
            'titulo',
            'descripcion',
            'precio',
            'categoria',
            'acciones',
          ];
    });

    this.dataSource = new ProductosListDataSource([]);
    this.listadoProductos = [];

    this.filterForm = this.formBuilder.group({});
    this.filterMode = false; //flag para saber si se está usando el buscador

    this.descripcionOpen = false; //flag para mantener abierto o cerrado el panel de ddescipciones

    this.categoriasService
      .getCategorias()
      .subscribe((data: any) => (this.categorias = data));
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      referencia: [''],
      titulo: [''],
      descripcion: [''],
      categoria: [''],
      precioDesde: [''],
      precioHasta: [''],
    });
  }

  ngAfterViewInit(): void {
    this.listarProductos();
  }

  listarProductos() {
    this.productosService.getProductos().subscribe((data: any) => {
      this.dataSource = new ProductosListDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });

    if (this.filterMode) {
      this.buildForm();
      this.filterMode = false;
    }
  }

  eliminarProducto(productoToDelete: Producto) {
    this.productosService.deleteProducto(productoToDelete).subscribe((data) => {
      this.listarProductos();
      this.notificationsService.openNotification(
        'Producto eliminado correctamente'
      );
    });
  }

  modificarProducto(productoToUpdate: Producto) {
    //envía el producto al componente formulario para poder modificarlo
    this.producto = productoToUpdate;
    this.abrirFormDialog();
  }

  abrirFormDialog() {
    const dialogRef = this.dialog.open(ProductosFormComponent, {
      width: '600px',
      height: '500px',
      data: { ...this.producto },
    });

    //si devuelve un producto, se envía al método que se encarga de modificar o añadir y una vez guardado se vacía la variable

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        this.listarProductos();
      }

    });
  }



  addProductToDetail(productoToAddDetail: Producto) {
    this.dialogRef.close(productoToAddDetail);
  }

  buscarProducto() {
    let filtros = this.filterForm.value;
    this.productosService.getProductos().subscribe((data) => {
      let productos = data as Producto[];

      if (filtros.referencia != '') {
        productos = productos.filter(
          (producto) =>
            producto.referencia
              .toLowerCase()
              .indexOf(filtros.referencia.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.titulo != '') {
        productos = productos.filter(
          (producto) =>
            producto.titulo
              .toLowerCase()
              .indexOf(filtros.titulo.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.descripcion != '') {
        productos = productos.filter(
          (producto) =>
            producto.descripcion
              .toLowerCase()
              .indexOf(filtros.descripcion.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.precioDesde != '') {
        productos = productos.filter(
          (producto) => producto.precio > parseFloat(filtros.precioDesde)
        );
        this.filterMode = true;
      }

      if (filtros.precioHasta != '') {
        productos = productos.filter(
          (producto) => producto.precio < parseFloat(filtros.precioHasta)
        );
        this.filterMode = true;
      }

      if (filtros.categoria != '') {
        productos = productos.filter((producto) => {
          if ('nombre' in producto.categoriaId) {
            return (
              producto.categoriaId.nombre.indexOf(filtros.categoria) !== -1
            );
          }
          return producto;
        });
        this.filterMode = true;
      }
      this.dataSource = new ProductosListDataSource(productos);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }
}
