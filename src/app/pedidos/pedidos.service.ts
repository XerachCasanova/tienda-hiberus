import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  urlBase: string;

  constructor(private httpClient: HttpClient) {
    this.urlBase = environment.urlBase + 'pedidos/';
  }

  getPedidos() {
    return this.httpClient.get(this.urlBase);
  }

  findPedido(pedido: Pedido): Observable<any> {
    let url = this.urlBase + pedido._id;

    return this.httpClient.get(url);
  }

  insertPedido(pedido: Pedido) {
    delete pedido._id;

    return this.httpClient
      .post(this.urlBase, pedido, { responseType: 'json' })
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  updatePedido(pedido: Pedido) {
    let url = this.urlBase + pedido._id;

    return this.httpClient.put(url, pedido, { responseType: 'json' }).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  deletePedido(pedido: Pedido) {
    let url = this.urlBase + pedido._id;

    return this.httpClient.delete(url).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
