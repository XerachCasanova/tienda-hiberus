import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  
  duracion = 5;

  constructor(private _snackBar: MatSnackBar) { }

  openNotification(message: string) {
    this._snackBar.open(message, undefined, {duration: this.duracion*1000});
  }

}


