import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pedido, PedidoDetalle } from 'src/app/models/pedido';
import { NotificationsService } from 'src/app/notifications.service';
import { PedidosFormDataSource } from 'src/app/pedidos/pedidos-form/pedidos-form-datasource';
import { PedidosService } from 'src/app/pedidos/pedidos.service';


@Component({
  selector: 'app-pedido-form-public',
  templateUrl: './pedido-form-public.component.html',
  styleUrls: ['./pedido-form-public.component.css']
})
export class PedidoFormPublicComponent implements OnInit {
  @Output() carritoToSend: EventEmitter<any> = new EventEmitter();

  cliente:any
  pedidoDetalle: PedidoDetalle[];
  dataSource: PedidosFormDataSource;
  pedidoForm: FormGroup;
  precioTotalCarrito!: number;

  displayedColumns: string[] = [ 
    'cantidad',
    'referencia',
    'producto',
    'precioUnitario',
    'precioTotal',
    'acciones',
  ];

  //Inyectamos en el dialog el array que contiene el pedido y el usuario.

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public pedido: any,
    public dialogRef: MatDialogRef<PedidoFormPublicComponent>,
    private pedidosService:PedidosService,
    private notificationsService:NotificationsService
    ) { 

      
    this.pedidoDetalle = [];
    this.dataSource = new PedidosFormDataSource([...this.pedido.carrito]);
    this.pedidoForm = this.formBuilder.group({});
    this.cliente = {
      nombre: '',
      apellido: '',
      email: '',
      dni: '',
      direcciones: [],
    }
  }

  ngOnInit(): void {
    
    
    this.buildForm();
  
  
    //Al iniciar, sumamos el precio total del array del carrito y rellenamos la tabla con sus datos.
    this.precioTotalCarrito = this.pedido.carrito.reduce( (a:any, b:any) => a + b.precioTotal, 0);
   
    this.dataSource.setData([...this.pedido.carrito]);

    
  }

  buildForm(){

    //TODO: EL formulario de pedidos es prácticamente el mismo para el back y el front, se puede
    //crear un servicio que reciba los datos y construya el formulario para ambos.

    //construimos el formulario con los distintos datos,
    this.pedidoForm = this.formBuilder.group({
      fecha: Date.now()
    })


    this.pedidoForm.setControl('clienteGroup', this.formBuilder.group({
      id: this.pedido.usuario._id,
      nombre: this.pedido.usuario.nombre,
      apellido: this.pedido.usuario.apellido,
      email: this.pedido.usuario.email,
      dni: this.pedido.usuario.dni,
    }));

 
    this.pedidoForm.setControl('direccionesGroup', this.formBuilder.group(
      {
        calle: ['', Validators.required],
        localidad: ['', Validators.required],
        provincia: ['', Validators.required],
        cp: ['', Validators.required],
      }
    ));

     
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
  }

  //Recibimos cada producto del array para sumar el total de cada producto * cantidad, seguidamente suma el total de todos los productos
  setPrecioTotal(producto:any) {

    producto.precioTotal = producto.precioUnitario * producto.cantidad;
    this.precioTotalCarrito = this.pedido.carrito.reduce( (a:any, b:any) => a + b.precioTotal, 0);
  }

  deleteProducto(index: number){
    
    this.pedido.carrito.splice(index, 1);
    this.dataSource.setData([...this.pedido.carrito]);

  }

  cancelarCarrito(){

    //devolvemos al componente que llamó el dialog el carrito para que pueda recalcular los datos.
    this.dialogRef.close(this.pedido.carrito);

  }
  
  
  comprar(){

    let pedidoDetalle = new Array()

    //creamos un array con el detalle del pedido
    this.pedido.carrito.forEach((data:any) => {

      pedidoDetalle.push({
        cantidad: data.cantidad,
        descuento: 0,
        refProducto: data.refProducto,
        tituloProducto: data.tituloProducto,
        precioUnitario: data.precioUnitario,
        precioTotal: data.precioTotal,
      })
    })
    
    //asignamos el resto de datos al pedido
    let pedido: Pedido = {
      numeroPedido: '',  
      fecha: this.pedidoForm.get('fecha')?.value,
      precioTotal: this.precioTotalCarrito,
      cliente: {
        idUsuario: this.pedidoForm.get('clienteGroup.id')?.value,
        nombre: this.pedidoForm.get('clienteGroup.nombre')?.value,
        apellido: this.pedidoForm.get('clienteGroup.apellido')?.value,
        email: this.pedidoForm.get('clienteGroup.email')?.value,
        dni: this.pedidoForm.get('clienteGroup.dni')?.value,
      },
      direccionEntrega: {
        calle: this.pedidoForm.get('direccionesGroup.calle')?.value,
        localidad: this.pedidoForm.get('direccionesGroup.localidad')?.value,
        provincia: this.pedidoForm.get('direccionesGroup.provincia')?.value,
        cp: this.pedidoForm.get('direccionesGroup.cp')?.value,
      },
      pedidoDetalle: pedidoDetalle
    
    }

    //enviamos el pedido a la base de datos.
    //TODO, antes de enviar el pedido se debería comprobar que el token sigue siendo válido.
    
    this.pedidosService.insertPedido(pedido).subscribe(data => {

      this.notificationsService.openNotification(
        'Pedido generado correctamente.'
      );
      this.dialogRef.close([]);
    }, (error) => {

      this.notificationsService.openNotification(
        'Ha habido algún error.'
      );
    });

  }

  onChangeDir(direccion: any) {
    //En la bd puede venir una id, la quitamos para evitar problemas.

    delete direccion._id;
    this.pedidoForm.get('direccionesGroup')?.setValue(direccion);
  }

}
