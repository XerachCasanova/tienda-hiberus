import { Injectable } from '@angular/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private usuariosService:UsuariosService) { }


  isAdmin(){

    return this.usuariosService.verifyUser().pipe(map((user:any) => {
        console.log(user.datosSecretos.username.tipoUsuario)
      if(user.datosSecretos.username.tipoUsuario === 'Administrador') {
        return true
      }
      else return false;
    }))

  
  }
}
