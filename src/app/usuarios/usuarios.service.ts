import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  urlBase: string;

  constructor(private httpClient: HttpClient) {
    this.urlBase = environment.urlBase + 'usuarios/';
  }

  getUsuarios() {
    return this.httpClient.get(this.urlBase);
  }
  
  verifyUser(){
    return this.httpClient.get(this.urlBase + 'verifyToken');
  
  }

  findUsuario(usuario: Usuario): Observable<any> {
    let url = this.urlBase + usuario._id;

    return this.httpClient.get(url);
  }

  findMe(username: string): Observable<any> {
    let url = this.urlBase + 'me';

    return this.httpClient.post(url, username);
  }


  findUsuarioById(id: string): Observable<any> {
    let url = this.urlBase + id;

    return this.httpClient.get(url);
  }

  insertUsuario(usuario: Usuario) {
    delete usuario._id;

    return this.httpClient
      .post(this.urlBase, usuario, { responseType: 'json' })
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  updateUsuario(usuario: Usuario) {
    let url = this.urlBase + usuario._id;

    return this.httpClient.put(url, usuario, { responseType: 'json' }).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  deleteUsuario(usuario: Usuario) {
    let url = this.urlBase + usuario._id;

    return this.httpClient.delete(url).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
