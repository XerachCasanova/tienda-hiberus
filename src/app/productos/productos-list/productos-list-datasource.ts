import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Producto } from 'src/app/models/producto';

export class ProductosListDataSource extends DataSource<Producto> {
  data: Producto[] = [];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(data: Producto[]) {
    super();

    this.data = data;
  }

  connect(): Observable<Producto[]> {
    if (this.paginator && this.sort) {
      return merge(
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.data]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  disconnect(): void {}

  private getPagedData(data: Producto[]): Producto[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Producto[]): Producto[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'referencia':
          return compare(+a.referencia, +b.referencia, isAsc);
        case 'titulo':
          return compare(+a.titulo, +b.titulo, isAsc);
        case 'descripcion':
          return compare(+a.descripcion, +b.descripcion, isAsc);
        case 'precio':
          return compare(+a.precio, +b.precio, isAsc);
        case 'categoria':
          return compare(+a.categoriaId, +b.categoriaId, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
