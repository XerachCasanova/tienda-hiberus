import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { Pedido } from 'src/app/models/pedido';
import { NotificationsService } from 'src/app/notifications.service';
import { PedidosFormComponent } from '../pedidos-form/pedidos-form.component';
import { PedidosService } from '../pedidos.service';
import { PedidosListDataSource } from './pedidos-list-datasource';

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
  selector: 'app-pedidos-list',
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css'],
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: ListPedidosCurrencyMaskConfig,
    },
  ]
})
export class PedidosListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Pedido>;

  dataSource: PedidosListDataSource;
  listadoProductos: Pedido[];

  pedido!: Pedido;

  displayedColumns = [
    'numeroPedido',
    'fecha',
    'precioTotal',
    'cliente',
    'email',
    'acciones',
  ];

  constructor(
    breakpointObserver: BreakpointObserver,
    private notificationsService: NotificationsService,
    private pedidosService: PedidosService,
    public dialog: MatDialog
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['numeroPedido', 'fecha', 'cliente', 'precioTotal', 'acciones']
        : [
            'numeroPedido',
            'fecha',
            'precioTotal',
            'cliente',
            'email',
            'acciones',
          ];
    });

    this.dataSource = new PedidosListDataSource([]);
    this.listadoProductos = [];
  }

  ngAfterViewInit(): void {
    this.listarPedidos();
  }

  listarPedidos() {
    this.pedidosService.getPedidos().subscribe((data: any) => {
      this.dataSource = new PedidosListDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  eliminarPedido(pedidoToDelete: Pedido) {
    this.pedidosService.deletePedido(pedidoToDelete).subscribe((data) => {
      this.listarPedidos();
      this.notificationsService.openNotification(
        'Pedido eliminado correctamente'
      );
    });
  }

  /* acción del botón modificar pedido de cada una de las tuplas de la tabla. */

  modificarPedido(pedidoToUpdate: Pedido) {
    this.pedido = pedidoToUpdate;

    delete this.pedido.direccionEntrega._id;
    this.abrirFormDialog();
  }

  /*Enviamos al componente formulario el pedido, abriéndose en forma de dialog */
  abrirFormDialog() {
    const dialogRef = this.dialog.open(PedidosFormComponent, {
      width: '1000px',
      height: '800px',
      data: { ...this.pedido },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Si devuelve un pedido, lo enviamos a guardar y reseteamos la variable.
      if (result) {

        this.listarPedidos();
      }

      this.pedido = {
        _id: '',
        numeroPedido: '',
        fecha: new Date(),
        precioTotal: 0,
        pedidoDetalle: [],
        cliente: {
          idUsuario: '',
          nombre: '',
          apellido: '',
          email: '',
          dni: '',
        },
        direccionEntrega: {
          calle: '',
          provincia: '',
          localidad: '',
          cp: '',
        },
      };
    });
  }
}
