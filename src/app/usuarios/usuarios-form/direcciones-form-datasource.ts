import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { PedidoDetalle } from 'src/app/models/pedido';

export interface Direccion {
  calle: string;
  localidad: string;
  provincia: string;
  cp: string;
}
export class DireccionesFormDataSource extends DataSource<Direccion> {
  private _dataStream = new ReplaySubject<Direccion[]>();

  constructor(initialData: Direccion[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Direccion[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Direccion[]) {
    console.log('valor', data);
    this._dataStream.next(data);
  }
}
