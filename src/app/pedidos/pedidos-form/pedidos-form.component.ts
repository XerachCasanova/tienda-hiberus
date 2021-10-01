import { Component, Inject, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ErroresComponent } from 'src/app/errores/errores/errores.component';
import { Pedido, PedidoDetalle } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { NotificationsService } from 'src/app/notifications.service';
import { ProductosListComponent } from 'src/app/productos/productos-list/productos-list.component';
import { UsuariosFormComponent } from 'src/app/usuarios/usuarios-form/usuarios-form.component';
import { UsuariosListComponent } from 'src/app/usuarios/usuarios-list/usuarios-list.component';
import { UsuariosService } from 'src/app/usuarios/usuarios.service';
import { PedidosService } from '../pedidos.service';
import { PedidosFormDataSource } from './pedidos-form-datasource';

//TODO: CONVERTIR EN FUNCIÓN EL CÁLCULO DEL PRECIO TOTAL DEL PEDIDO Y DEL PRECIO TOTAL DE CADA PRODUCTO

@Component({
  selector: 'app-pedidos-form',
  templateUrl: './pedidos-form.component.html',
  styleUrls: ['./pedidos-form.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LLLL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class PedidosFormComponent {
  displayedColumns: string[] = [
    'cantidad',
    'referencia',
    'producto',
    'descuento',
    'precioUnitario',
    'precioTotal',
    'acciones',
  ];
  dataSource: PedidosFormDataSource;

  //flags y nombre del botón para saber si se está añadiendo o editando.
  updateDeliState!: boolean;
  updateDetailState!: boolean;
  buttonAddUpdateDeli!: string;

  pedidoForm: FormGroup;
  precioTotalPedido: number;
  pedidoDetalle: PedidoDetalle[];
  producto!: Producto;
  productSelected: boolean;

  cliente!: Usuario;
  clientSelected!: boolean;

  listadoProductos!: Producto[];

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PedidosFormComponent>,
    public dialogErroresRef: MatDialogRef<ErroresComponent>,
    public dialogRefCliente: MatDialogRef<UsuariosFormComponent>,
    private usuarioService: UsuariosService,
    private pedidosService: PedidosService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public pedido: Pedido
  ) {
    this.pedidoDetalle = [];

    this.dataSource = new PedidosFormDataSource(this.pedidoDetalle);
    this.precioTotalPedido = 0;
    this.pedidoForm = this.formBuilder.group({});
    this.productSelected = false;
    this.clientSelected = false;

    //Si el pedido tiene ID entramos en modo actualizar y si no en modo añadir.
    this.pedido._id ? this.updatePedidoMode() : this.addPedidoMode();
  }

  clearPedido() {
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
  }

  private buildForm() {
    this.pedidoForm = this.formBuilder.group(this.pedido);

    this.pedidoForm.get('fecha')?.setValidators(Validators.required);
    this.pedidoForm.get('numeroPedido')?.disable();

    this.pedidoForm.setControl(
      'clienteGroup',
      this.formBuilder.group(this.pedido.cliente)
    );
    this.pedidoForm
      .get('clienteGroup')
      ?.get('nombre')
      ?.setValidators(Validators.required);
    this.pedidoForm
      .get('clienteGroup')
      ?.get('apellido')
      ?.setValidators(Validators.required);

    this.pedidoForm.setControl(
      'direccionesGroup',
      this.formBuilder.group(this.pedido.direccionEntrega)
    );
    this.pedidoForm
      .get('direccionesGroup')
      ?.get('calle')
      ?.setValidators(Validators.required);
    this.pedidoForm
      .get('direccionesGroup')
      ?.get('localidad')
      ?.setValidators(Validators.required);
    this.pedidoForm
      .get('direccionesGroup')
      ?.get('provincia')
      ?.setValidators(Validators.required);
    this.pedidoForm
      .get('direccionesGroup')
      ?.get('cp')
      ?.setValidators(Validators.required);

    this.pedidoForm.setControl(
      'detalleGroup',
      this.formBuilder.group({
        tituloProducto: [''],
        precioUnitario: 0,
        precioTotal: 0,
        cantidad: [1, Validators.min(1)],
        descuento: [0, Validators.min(0)],
        refProducto: [''],
      })
    );

    this.pedidoForm.get('clienteGroup.nombre')?.disable();
    this.pedidoForm.get('clienteGroup.apellido')?.disable();
    this.pedidoForm.get('clienteGroup.dni')?.disable();
    this.pedidoForm.get('clienteGroup.email')?.disable();
  }

  save() {
    this.calcularPrecioTotalPedido();

    this.pedido.precioTotal = this.precioTotalPedido;
    this.pedido.pedidoDetalle = [...this.pedidoDetalle];

    //variable auxiliar para poder utilizar getRawValue de un grupo anidado.
    let grupoCliente = this.pedidoForm.get('clienteGroup') as FormGroup;

    this.pedido = {
      numeroPedido: this.pedidoForm.get('numeroPedido')?.value,
      fecha: this.pedidoForm.get('fecha')?.value,
      precioTotal: this.precioTotalPedido,
      pedidoDetalle: [...this.pedidoDetalle],
      cliente: { ...grupoCliente.getRawValue() },
      direccionEntrega: { ...this.pedidoForm.get('direccionesGroup')?.value },
    };

    //Si estamos en modo actualizar, añadimos la id del pedido.
    if (this.updateDeliState){
      this.pedido = { ...this.pedido, _id: this.pedidoForm.controls._id.value };
    }  
      
    let request;

    let accion: string;
  
    if (!this.pedido._id || this.pedido._id == '') {
      request = this.pedidosService.insertPedido(this.pedido);
      accion = 'creado';
    } else {
      request = this.pedidosService.updatePedido(this.pedido);
      accion = 'modificado';
    }

    request.subscribe(
      (data) => {
        this.dialogRef.close(true);
        this.notificationsService.openNotification(
          'Pedido ' + accion + ' correctamente'
        );
      },
      (error) => {
        this.abrirErrorDialog(error);
      }
    );

  }

  abrirErrorDialog(errores:any) {
    const dialogErroresRef = this.dialog.open(ErroresComponent, {
      width: '400px',
      height: '300px',
      data: { errores },
    });

  }


  //-----AÑADIDO Y ELIMINACIÓN DE PRODUCTOS DEL DETALLE DEL PEDIDO //----------

  deleteProductoFromDetalle(index: number) {
    this.pedidoDetalle.splice(index, 1);
    this.calcularPrecioTotalPedido();
    this.dataSource.setData([...this.pedidoDetalle]);
  }

  addProductToDetail() {
    //Cálculo de cada producto del detalle con la cantidad, precio unidad y dto.
    let cantidad = this.pedidoForm.get('detalleGroup')?.value.cantidad;
    let descuento = this.pedidoForm.get('detalleGroup')?.value.descuento;
    let precioU = this.producto.precio;
    let precioTotal = precioU * cantidad;

    this.pedidoForm.get('detalleGroup')?.setValue({
      cantidad: cantidad,
      descuento: descuento,
      refProducto: this.producto.referencia,
      tituloProducto: this.producto.titulo,
      precioUnitario: this.producto.precio,
      precioTotal: precioTotal - precioTotal * (descuento / 100),
    });

    this.pedidoDetalle.push(this.pedidoForm.get('detalleGroup')?.value);

    /*actualizamos el datasource de la tabla del detalle del pedido
    recalculamos el precio total del pedido y reseteamos las variables de producto*/

    this.dataSource.setData([...this.pedidoDetalle]);
    this.calcularPrecioTotalPedido();
    this.resetProducto();
  }

  calcularPrecioTotalPedido() {
    //Cálculo del total del pedido completo.
    this.precioTotalPedido = this.pedidoDetalle.reduce(
      (a, b) => a + b.precioTotal,
      0
    );
  }

  //Desplegable de direcciones.

  onChangeDir(direccion: any) {
    //En la bd puede venir una id, la quitamos para evitar problemas.

    delete direccion._id;
    this.pedidoForm.get('direccionesGroup')?.setValue(direccion);
  }

  //Se abre el componente de lista de usuarios para elegir el cliente del pedido.
  abrirFormDialogCliente() {
    /*isDetailDialog para saber si el componente que se va abrir es diálogo o no,
    ya que dependiendo de eso, tendrá un comportamiento u otro.*/

    const dialogRefCliente = this.dialog.open(UsuariosListComponent, {
      width: '1000px',
      height: '600px',
      data: { isDetailDialog: true },
    });

    dialogRefCliente.afterClosed().subscribe((result) => {
      /*Si devuelve un cliente, se activa el flag de cliente seleccionado y se
      //genera un objeto cliente.*/

      if (result) {
        this.cliente = result;
        this.clientSelected = true;

        this.pedidoForm.get('clienteGroup')?.setValue({
          idUsuario: this.cliente._id,
          nombre: this.cliente.nombre,
          apellido: this.cliente.apellido,
          email: this.cliente.email,
          dni: this.cliente.dni,
        });
      }
    });
  }

  //Se abre el componente de lista de productos para añadir productos al pedido..

  abrirFormDialogProducto() {
    const dialogRef = this.dialog.open(ProductosListComponent, {
      width: '1000px',
      height: '600px',
      data: { isDetailDialog: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      /* Si se devuelve un producto, se busca el producto en el array
      del detalle del pedido y si lo encuentra, en vez de duplicar el dato,
      suma uno a la cantidad del producto ya existente y recalcula su precio. */
      if (result) {
        let productoEnDetalle = this.pedidoDetalle.filter(
          (data) => data.refProducto == result.referencia
        );

        if (productoEnDetalle.length == 0) {
          this.producto = result;
          this.productSelected = true;
        } else {
          productoEnDetalle[0].cantidad = productoEnDetalle[0].cantidad + 1;

          let precioTotal =
            productoEnDetalle[0].precioUnitario * productoEnDetalle[0].cantidad;
          productoEnDetalle[0].precioTotal =
            precioTotal - precioTotal * (productoEnDetalle[0].descuento / 100);

          this.pedidoDetalle = [
            ...this.pedidoDetalle.filter(
              (data) => data.refProducto != result.referencia
            ),
            ...productoEnDetalle,
          ];

          this.dataSource.setData(this.pedidoDetalle); 
        }
      }
    });
  }

  updatePedidoMode() {
    /* Si el componente se ejecuta en modo update, rellenamos el formulario
    a partir de los datos del cliente y los datos del pedido a modificar y  */
    this.pedidoDetalle = this.pedido.pedidoDetalle;

    this.dataSource.setData([...this.pedido.pedidoDetalle]);
    this.calcularPrecioTotalPedido();

    this.buildForm();

    this.updateDeliState = true;
    this.buttonAddUpdateDeli = 'Guardar cambios';

    this.usuarioService
      .findUsuarioById(this.pedido.cliente.idUsuario)
      .subscribe((usuario) => (this.cliente = usuario));
  }

  addPedidoMode() {
    /* Si entramos en modo añadir, reseteamos el formulario y las variables */

    this.clearPedido();
    this.buildForm();
    this.resetPedidoDetalle();
    this.updateDeliState = false;
    this.buttonAddUpdateDeli = 'Añadir';
  }

  resetProducto() {
    this.producto = {
      titulo: '',
      referencia: '',
      descripcion: '',
      precio: 0,
      categoriaId: '',
    };

    this.productSelected = false;

    this.resetPedidoDetalleForm();
  }

  reset() {
    this.clearPedido();
    this.dialogRef.close();
  }

  resetPedidoDetalle() {
    this.pedidoDetalle = new Array();
  }

  resetPedidoDetalleForm() {
    this.pedidoForm.controls.detalleGroup.setValue({
      cantidad: 1,
      descuento: 0,
      refProducto: '',
      tituloProducto: '',
      precioUnitario: 0,
      precioTotal: 0,
    });
  }
}
