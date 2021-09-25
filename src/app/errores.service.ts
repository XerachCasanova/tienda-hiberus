import { Injectable } from '@angular/core';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class ErroresService {

  constructor(private notificationsService:NotificationsService) { }

  manageError(data:any){

    //TODO: Gestionar los mensajes de errores fuera de las notificaciones y que salgan listados en cada pantalla.
    if(data.status == 400) {

      let errores = new Array();
      errores = data.error.errors.map((error:any) => error.msg);
  
      this.notificationsService.openNotification('Los datos introducidos no son correctos: ' + errores.toString());
    }
  }
}
