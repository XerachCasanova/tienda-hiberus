import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PedidoFormPublicComponent } from '../pedido-form-public/pedido-form-public.component';
import { UsuariosService } from 'src/app/usuarios/usuarios.service';
import { LoginComponent } from 'src/app/login/login.component';
import { PedidoDetalle } from 'src/app/models/pedido';

@Component({
  selector: 'app-publicshell',
  templateUrl: './publicshell.component.html',
  styleUrls: ['./publicshell.component.css']
})
export class PublicshellComponent implements OnInit {
  
  nProductosBudget:number
  carrito:PedidoDetalle[];
  constructor(
    public dialog: MatDialog,
    private usuariosService: UsuariosService
    ) { 
  
    this.carrito = []; 

    this.nProductosBudget = 0;
  }

  ngOnInit(): void {
  }

  abrirDialogPedido(usuarioVerificado:any){
    
    this.usuariosService.findMe(usuarioVerificado.datosSecretos.username).subscribe(data => {
      console.log(this.carrito)
      let dialogRef = this.dialog.open(PedidoFormPublicComponent, {
        width: '1000px',
        height: '800px',
        data: {usuario: data, carrito: this.carrito}
      });
      dialogRef.afterClosed().subscribe((result)=> {
        
        
        //DESEMPAQUETAR CARRITO Y RECONVERTIRLO
      })
      
    });

  }

  async abrirFormDialog(){
    
    let usuarioVerificado:any = await this.usuariosService.verifyUser().toPromise();

      if (usuarioVerificado.datosSecretos){

        this.abrirDialogPedido(usuarioVerificado);

      } else {
        
        let dialogRef = this.dialog.open(LoginComponent, {
          width: '400px',
          height: '340px',
          data: {isDialog: true}
        });

        dialogRef.afterClosed().subscribe(async (result) => {
          usuarioVerificado = await this.usuariosService.verifyUser().toPromise();

          if(usuarioVerificado.datosSecretos) this.abrirDialogPedido(usuarioVerificado);
          
        })

      }
 

  }

  onActivate(dataChild:any) {
    
    dataChild.carritoToSend.subscribe((data:any) => {
      this.nProductosBudget = data.length
      this.carrito = data;

      

   })

 }

}
