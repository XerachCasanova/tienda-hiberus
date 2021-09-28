import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tipoUsuario, Usuario } from 'src/app/models/usuario';
import { UsuariosService } from '../usuarios.service';
import { UsuariosListDataSource } from './usuarios-list.datasource';
import { UsuariosFormComponent } from '../usuarios-form/usuarios-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsService } from 'src/app/notifications.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css'],
})
export class UsuariosListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Usuario>;

  panelExtDirecciones!: boolean[];

  tipoUsuarioList: tipoUsuario[];
  listadoUsuarios: Usuario[];
  usuario!: Usuario;

  filterForm: FormGroup;
  filterMode: boolean;
  showFilter: boolean;

  dataSource: UsuariosListDataSource;
  displayedColumns = [
    'nombre',
    'apellido',
    'dni',
    'email',
    'username',
    'tipoUsuario',
    'direcciones',
    'acciones',
  ];

  constructor(
    breakpointObserver: BreakpointObserver,
    private notificationsService: NotificationsService,
    private usuariosService: UsuariosService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Optional() public dialogRef: MatDialogRef<UsuariosListComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public isUsuarioDialog: boolean
  ) {
    breakpointObserver.observe(['(max-width: 700px)']).subscribe((result) => {
      this.displayedColumns = result.matches
        ? ['dni', 'nombre', 'acciones']
        : [
            'nombre',
            'dni',
            'email',
            'username',
            'tipoUsuario',
            'direcciones',
            'acciones',
          ];
    });
    this.tipoUsuarioList = Object.values(tipoUsuario);

    this.dataSource = new UsuariosListDataSource([]);
    this.listadoUsuarios = [];

    this.filterForm = this.formBuilder.group({});
    this.showFilter = false;
    this.filterMode = false; //flag para saber si el buscador está activo
    this.buildForm();
  }

  ngAfterViewInit() {
    this.listarUsuarios();
  }

  buildForm() {
    this.filterForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      dni: [''],
      email: [''],
      username: [''],
      tipoUsuario: [''],
      categoria: [''],
    });
  }

  eliminarUsuario(usuarioToDelete: Usuario) {
    this.usuariosService.deleteUsuario(usuarioToDelete).subscribe((data) => {
      this.listarUsuarios();

      this.notificationsService.openNotification(
        'Usuario eliminado correctamente'
      );
    });
  }

  //Envía el usuario al componente formulario para poder modificarlo.
  modificarUsuario(usuarioToUpdate: Usuario) {
    this.usuario = usuarioToUpdate;
    this.abrirFormDialog();
  }

  public listarUsuarios() {
    this.usuariosService.getUsuarios().subscribe((data: any) => {
      this.dataSource = new UsuariosListDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      this.panelExtDirecciones = new Array(data.length);

      this.panelExtDirecciones.fill(false);
    });

    if (this.filterMode) {
      this.buildForm();
      this.filterMode = false;
    }
  }

  addClientToDetail(clienteToAddDetail: Usuario) {
    this.dialogRef.close(clienteToAddDetail);
  }

  abrirFormDialog() {
    const dialogRef = this.dialog.open(UsuariosFormComponent, { 
      width: '700px',
      height: '800px',
      data: { ...this.usuario },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //Si el formulario devuelve un usuario, se rellena la variable usuario, se envía al método que añade o modifica y se limpia el usuario.
      if (result) {
        this.listarUsuarios();
      }
    });
  }

  buscarUsuario() {
    let filtros = this.filterForm.value;
    this.usuariosService.getUsuarios().subscribe((data) => {
      let usuarios = data as Usuario[];

      if (filtros.nombre != '') {
        usuarios = usuarios.filter(
          (usuario) =>
            usuario.nombre
              .toLowerCase()
              .indexOf(filtros.nombre.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.apellido != '') {
        usuarios = usuarios.filter(
          (usuario) =>
            usuario.apellido
              .toLowerCase()
              .indexOf(filtros.apellido.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.dni != '') {
        usuarios = usuarios.filter(
          (usuario) =>
            usuario.dni.toLowerCase().indexOf(filtros.dni.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.email != '') {
        usuarios = usuarios.filter(
          (usuario) =>
            usuario.email.toLowerCase().indexOf(filtros.email.toLowerCase()) !==
            -1
        );
        this.filterMode = true;
      }

      if (filtros.username != '') {
        usuarios = usuarios.filter(
          (usuario) =>
            usuario.username
              .toLowerCase()
              .indexOf(filtros.username.toLowerCase()) !== -1
        );
        this.filterMode = true;
      }

      if (filtros.tipoUsuario != '') {
        usuarios = usuarios.filter(
          (usuario) => usuario.tipoUsuario.indexOf(filtros.tipoUsuario) !== -1
        );
        this.filterMode = true;
      }

      this.dataSource = new UsuariosListDataSource(usuarios);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
    });
  }
}
