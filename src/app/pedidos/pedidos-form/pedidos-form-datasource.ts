import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { PedidoDetalle } from 'src/app/models/pedido';

export class PedidosFormDataSource extends DataSource<PedidoDetalle> {
  private _dataStream = new ReplaySubject<PedidoDetalle[]>();

  constructor(initialData: PedidoDetalle[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<PedidoDetalle[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: PedidoDetalle[]) {
    this._dataStream.next(data);
  }
}
