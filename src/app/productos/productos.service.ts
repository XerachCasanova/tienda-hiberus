import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Producto } from '../models/producto';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  urlBase: string;

  constructor(private httpClient: HttpClient) {
    this.urlBase = environment.urlBase + 'productos/';
  }

  getProductos() {
    return this.httpClient.get(this.urlBase);
  }

  findProducto(producto: Producto): Observable<any> {
    let url = this.urlBase + producto._id;

    return this.httpClient.get(url);
  }

  insertProducto(producto: Producto) {
    delete producto._id;

    return this.httpClient
      .post(this.urlBase, producto, { responseType: 'json' })
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(error);
        })
      );
  }

  updateProducto(producto: Producto) {
    let url = this.urlBase + producto._id;

    return this.httpClient.put(url, producto, { responseType: 'json' }).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  deleteProducto(producto: Producto) {
    let url = this.urlBase + producto._id;

    return this.httpClient.delete(url).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
