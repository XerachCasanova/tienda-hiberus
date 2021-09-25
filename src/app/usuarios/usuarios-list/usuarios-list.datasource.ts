import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';

export class UsuariosListDataSource extends DataSource<Usuario> {
  data: Usuario[];
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(listaUsuarios: Usuario[]) {
    super();

    this.data = listaUsuarios;
  }

  connect(): Observable<Usuario[]> {
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

  private getPagedData(data: Usuario[]): Usuario[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Usuario[]): Usuario[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'nombre':
          return compare(a.nombre, b.nombre, isAsc);
        case 'apellido':
          return compare(+a.apellido, +b.apellido, isAsc);
        case 'dni':
          return compare(+a.dni, +b.dni, isAsc);
        case 'email':
          return compare(+a.email, +b.email, isAsc);
        case 'username':
          return compare(+a.username, +b.username, isAsc);
        case 'tipoUsuario':
          return compare(+a.tipoUsuario, +b.tipoUsuario, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
