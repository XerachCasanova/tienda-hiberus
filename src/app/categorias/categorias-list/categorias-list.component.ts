import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ErroresService } from 'src/app/errores.service';
import { Categoria } from 'src/app/models/categoria';
import { NotificationsService } from 'src/app/notifications.service';
import { CategoriasFormComponent } from '../categorias-form/categorias-form.component';
import { CategoriasService } from '../categorias.service';
import { CategoriasListDataSource } from './categorias-list-datasource';

@Component({
  selector: 'app-categorias-list',
  templateUrl: './categorias-list.component.html',
  styleUrls: ['./categorias-list.component.css'],
})
export class CategoriasListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Categoria>;

  dataSource: CategoriasListDataSource;
  listadoCategorias: Categoria[];
  categoria!: Categoria;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nombre', 'acciones'];

  constructor(
    breakpointObserver: BreakpointObserver,
    private erroresService: ErroresService,
    private notificationsService: NotificationsService,
    private categoriasService: CategoriasService,
    public dialog: MatDialog
  ) {
    breakpointObserver.observe(['(max-width: 600px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['nombre', 'acciones']
        : ['nombre', 'acciones'];
    });

    this.dataSource = new CategoriasListDataSource([]);
    this.listadoCategorias = [];
  }

  ngAfterViewInit(): void {
    this.listarCategorias();
  }

  private listarCategorias() {
    this.categoriasService.getCategorias().subscribe((data: any) => {
      this.dataSource = new CategoriasListDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }

  save() {
    let accion: string;
    let request;
    if (this.categoria._id == '') {
      request = this.categoriasService.insertCategoria(this.categoria);
      accion = 'creada';
    } else {
      request = this.categoriasService.updateCategoria(this.categoria);

      accion = 'modificada';
    }

    request.subscribe(
      (data) => {
        this.listarCategorias();
        this.notificationsService.openNotification(
          'Categoría ' + accion + ' correctamente'
        );
      },
      (error) => {
        this.erroresService.manageError(error);
      }
    );
  }

  eliminarCategoria(categoriaToDelete: Categoria) {
    this.categoriasService
      .deleteCategoria(categoriaToDelete)
      .subscribe((data) => {
        this.listarCategorias();
        this.notificationsService.openNotification(
          'Categoría eliminada correctamente'
        );
      });
  }

  modificarCategoria(categoriaToUpdate: Categoria) {
    this.categoria = categoriaToUpdate;
    this.abrirFormDialog();
  }

  abrirFormDialog() {
    const dialogRef = this.dialog.open(CategoriasFormComponent, {
      width: '800px',
      height: '300px',
      data: { ...this.categoria },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoria = { ...result };
        this.save();
      }

      this.categoria = {
        _id: '',
        nombre: '',
      };
    });
  }
}
