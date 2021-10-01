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

    let carritoSinDuplicados = this.pedido.carrito.filter((item:any,index:number)=>{
      return this.pedido.carrito.indexOf(item) === index;
    })

    

    carritoSinDuplicados.forEach((producto:any) => {


      for(let i=0; i<this.pedido.carrito.length; i++){
        if (this.pedido.carrito[i].referencia == producto.referencia) producto.cantidad++;
      }

      producto.precioTotal = producto.precio * producto.cantidad;
    })

    this.pedido.carrito = carritoSinDuplicados;
    this.precioTotalCarrito = this.pedido.carrito.reduce( (a:any, b:any) => a + b.precioTotal, 0);
    this.dataSource.setData([...this.pedido.carrito]);
  }

  buildForm(){
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

    this.pedidoForm.setControl('direccionesGroup', this.formBuilder.group(this.pedido.usuario.direcciones[0]));

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
    
  }

  setPrecioTotal(producto:any) {

    producto.precioTotal = producto.precio * producto.cantidad;
    this.precioTotalCarrito = this.pedido.carrito.reduce( (a:any, b:any) => a + b.precioTotal, 0);
  }

  deleteProducto(index: number){
    
    this.pedido.carrito.splice(index, 1);
    this.dataSource.setData([...this.pedido.carrito]);

  }

  cancelarCarrito(){

    this.dialogRef.close(this.pedido);

  }
  

  comprar(){

    let pedidoDetalle = new Array()


    this.pedido.carrito.forEach((data:any) => {

      pedidoDetalle.push({
        cantidad: data.cantidad,
        descuento: 0,
        refProducto: data.referencia,
        tituloProducto: data.titulo,
        precioUnitario: data.precio,
        precioTotal: data.precioTotal,
      })
    })


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

  
    this.pedidosService.insertPedido(pedido).subscribe(data => {
      this.notificationsService.openNotification(
        'Pedido generado correctamente.'
      );
      this.dialogRef.close();
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
