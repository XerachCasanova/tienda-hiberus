import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  urlBase: string;

  constructor(private httpClient: HttpClient) {
    this.urlBase = environment.urlBase + 'categorias/';
  }

  getCategorias(): Observable<any> {
    let url = this.urlBase;

    return this.httpClient.get(url);
  }

  findCategoria(categoria: Categoria): Observable<any> {
    let url = this.urlBase + categoria._id;

    return this.httpClient.get(url);
  }

  insertCategoria(categoria: Categoria) {
    let url = this.urlBase;

    delete categoria._id;

    return this.httpClient.post(url, categoria, { responseType: 'json' }).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  updateCategoria(categoria: Categoria) {
    let url = this.urlBase + categoria._id;

    return this.httpClient.put(url, categoria, { responseType: 'json' }).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  deleteCategoria(categoria: Categoria) {
    let url = this.urlBase + categoria._id;

    return this.httpClient.delete(url).pipe(
      catchError((error) => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
