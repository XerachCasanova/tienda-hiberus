import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PedidoFormPublicComponent } from '../pedido-form-public/pedido-form-public.component';
import { UsuariosService } from 'src/app/usuarios/usuarios.service';
import { LoginComponent } from 'src/app/login/login.component';
import { PedidoDetalle } from 'src/app/models/pedido';
import { UserAuthService } from 'src/app/authentication/user-auth.service';

//TODO: Convertir la lógica del carrito en un behavior subject. Actualmente se gestiona
//a través de un onActivate en el router outlet.

//TODO. Crear un servicio para recoger y enviar datos al localstorage: carrito, payload...

@Component({
  selector: 'app-publicshell',
  templateUrl: './publicshell.component.html',
  styleUrls: ['./publicshell.component.css']
})
export class PublicshellComponent implements OnInit {
  isAdmin!:boolean;
  nProductosBudget:number
  carrito:PedidoDetalle[];
  constructor(
    public dialog: MatDialog,
    private usuariosService: UsuariosService,
    private userAuthService: UserAuthService,

    ) { 
    this.userAuthService.isAdmin().subscribe(admin => this.isAdmin = admin);
    this.carrito = []; 
    this.nProductosBudget = 0;
  }

  ngOnInit(): void {
  }

  //Verificamos el usuario contra el servidor y llamamos a la función que abre el dialog del pedido
  //pasando los datos del payload
  //TODO: estuve intentando crear un servicio que verifique al usuario y en el mismo observable
  //se busque también en la base de datos el usuario a partir del payload, pero soy incapaz de
  //hacer que devuelva los datos del usuario en un solo observable anidando con map. (Devuelve 
  //un observable y no los datos del usuario.)

  async abrirFormDialog(){
    
    this.usuariosService.verifyUser().subscribe(user => {
      this.abrirDialogPedido(user)
    },error => {
      let dialogRef = this.dialog.open(LoginComponent, {
        width: '400px',
        height: '340px',
        data: {isDialog: true}
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        
        this.usuariosService.verifyUser().subscribe(user => {
          this.abrirDialogPedido(user)
        });
      })

    })

  }

  //abrimos el dialog del pedido a partir del usuario ya verificado que se recibe como parámetro
  //y enviamos el contenido del array del carrito y los datos del usuario.

  abrirDialogPedido(usuarioVerificado:any){
    
    this.usuariosService.findMe(usuarioVerificado.datosSecretos.username).subscribe(data => {

      let dialogRef = this.dialog.open(PedidoFormPublicComponent, {
        width: '1000px',
        height: '800px',
        data: {usuario: data, carrito: this.carrito}
      });
      dialogRef.afterClosed().subscribe((carritoDevuelto)=> {

        this.nProductosBudget = 0;
        carritoDevuelto.forEach((data:any) => this.nProductosBudget += data.cantidad)
      })
      
    });

  }

  //Este método está a la escucha de los cambios que se hagan en el componente productos,
  //cada vez que se añade un producto al carrito, se recibe el array completo y nos podemos
  //suscribir a esos cambios.
  onActivate(dataChild:any) {
    
    dataChild.carritoToSend.subscribe((data:any) => {
      
      //Llamamos a la función que se encarga de agrupar los productos repetidos.
      this.agruparProductos(data)
      this.nProductosBudget = data.length
   })

 }

 agruparProductos(data:PedidoDetalle[]){
      
      //Debido a que se puede recibir el carrito más de una vez, reasignamos cero a la cantidad de cada producto
      this.carrito = this.carrito.map(prod => { return {...prod, cantidad: 0 }})
    
      //En un primer paso filtramos los datos eliminando los repetidos.
      data.forEach((producto:PedidoDetalle)=>{

      if (this.carrito.filter(prod => prod.refProducto == producto.refProducto ).length == 0){
        console.log(producto)
        this.carrito.push({...producto});
      }

    })

    //Para cada producto del carrito filtrado recorremos el array original y asignamos la cantidad
    //contamos la cantidad existente para cada uno de ellos.

    this.carrito.forEach((producto:any) => {

      for(let i=0; i<data.length; i++){
        if (data[i].refProducto == producto.refProducto) producto.cantidad++;
      }

      producto.precioTotal = producto.precioUnitario * producto.cantidad;
    })
  
   
 }

}
