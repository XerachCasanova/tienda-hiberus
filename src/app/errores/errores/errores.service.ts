import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ErroresService {

  constructor() { }

  manageError(data:any){

    //TODO: Gestionar los mensajes de errores fuera de las notificaciones y que salgan listados en cada pantalla.
    if(data.status == 400) {

      let errores = new Array();
  
      return data.error.errors.map((error:any) => error.msg);
      
    }
  }
}
