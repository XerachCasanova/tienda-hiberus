import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tipoUsuario, Usuario } from 'src/app/models/usuario';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DireccionesFormDataSource } from './direcciones-form-datasource';
import { NotificationsService } from 'src/app/notifications.service';
import { UsuariosService } from '../usuarios.service';
import { ErroresComponent } from 'src/app/errores/errores/errores.component';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css'],
})
export class UsuariosFormComponent {
  displayedColumns: string[] = [
    'calle',
    'localidad',
    'provincia',
    'cp',
    'acciones',
  ];
  dataSource: DireccionesFormDataSource;

  //Flags para saber si se está modificando o añadiendo, tanto el usuario como el array de direcciones
  updateUserState!: boolean;
  updateDirState!: boolean;
  buttonAddUpdateUser!: string;
  buttonAddUpdateDir!: string;

  usuarioForm: FormGroup;

  tipoUsuario = Object.values(tipoUsuario);

  direcciones = new Array();

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UsuariosFormComponent>,
    public dialogErroresRef: MatDialogRef<ErroresComponent>,
    public dialog: MatDialog,
    private usuariosService:UsuariosService,
    private notificationsService:NotificationsService,
    @Inject(MAT_DIALOG_DATA) public usuario: Usuario
  ) {
    this.usuarioForm = this.formBuilder.group({});
    this.dataSource = new DireccionesFormDataSource(this.direcciones);
  }

  ngOnInit(): void {
    this.buildForm();
    this.resetDirecciones();
    this.resetDireccionesForm();
    this.addDirMode();
    this.usuario._id ? this.updateUsuarioMode() : this.addUsuarioMode();
  }

  private buildForm() {
    this.usuarioForm = this.formBuilder.group({
      usuariosGroup: this.formBuilder.group({
        _id: [''],
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        dni: ['', Validators.required],
        email: ['', Validators.required],
        username: ['', Validators.required],
        clave: ['', Validators.required],
        tipoUsuario: ['', Validators.required],
      }),
      direccionesGroup: this.formBuilder.group({
        index: [''],
        calle: ['', Validators.required],
        provincia: ['', Validators.required],
        localidad: ['', Validators.required],
        cp: ['', Validators.required],
      }),
    });
  }

  save() {
    //Eliminamos el campo index antes de enviar a la bd, ya que solo es un indicador para el array direcciones

    this.direcciones.forEach((dir) => delete dir.index); 

    //construimos el usuario para enviarlo al componente lista, que se encarga de enviarlo al backend
    this.usuario = {
      ...this.usuarioForm.controls.usuariosGroup.value,
      direcciones: [...this.direcciones],
    };

    let accion: string;

    let request;
    if (this.usuario._id == '') {
      request = this.usuariosService.insertUsuario(this.usuario);
      accion = 'creado';
    } else {
      request = this.usuariosService.updateUsuario(this.usuario);
      accion = 'modificado';
    }

    request.subscribe(
      (data) => {
        
        this.notificationsService.openNotification(
          'Usuario ' + accion + ' correctamente'
        );
        this.dialogRef.close(true);
      },
      (error) => {
        //this.erroresService.manageError(error);

        this.abrirErrorDialog(error)
      }
    );
  }

  abrirErrorDialog(errores:any) {
    const dialogErroresRef = this.dialog.open(ErroresComponent, {
      width: '400px',
      height: '300px',
      data: { errores },
    });

  }

  //-----------------------------Gestión del array direcciones--------------------------------//

  addDireccion() {
    if (!this.updateDirState) {
      this.direcciones.push({
        ...this.usuarioForm.controls.direccionesGroup.value,
      });
    } else {
      //Guardo la dirección en la posición del array de la dirección a modificar y hago splice
      let index = this.usuarioForm.controls.direccionesGroup.value.index;
      this.direcciones.splice(index, 1, {
        ...this.usuarioForm.controls.direccionesGroup.value,
      });
    }

    this.dataSource.setData([...this.direcciones]);
    this.resetDireccionesForm();
    this.addDirMode();
  }

  deleteDireccion(index: number) {
    this.direcciones.splice(index, 1);
    this.dataSource.setData([...this.direcciones]);
  }

  updateDireccion(index: number) {
    this.updateDirMode();

    this.usuarioForm.controls.direccionesGroup.setValue({
      index: index,
      calle: this.direcciones[index].calle,
      localidad: this.direcciones[index].localidad,
      provincia: this.direcciones[index].provincia,
      cp: this.direcciones[index].cp,
    });
  }

  //--------------------------------------------------- RESETS DE VARIABLES Y FORMULARIOS ------------------------------------------------------//

  reset() {
    this.resetUsuario();
    this.resetUsuarioForm();
    this.resetDirecciones();
    this.resetDireccionesForm();

    this.addUsuarioMode();

    this.dialogRef.close();
  }

  resetUsuarioForm() {
    this.usuarioForm.controls.usuariosGroup.setValue({
      _id: '',
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      username: '',
      clave: '',
      tipoUsuario: tipoUsuario.CLIENT,
    });

    this.usuarioForm.get('usuariosGroup')?.markAsUntouched();
  }

  resetUsuario() {
    this.usuario = {
      _id: '',
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      username: '',
      clave: '',
      tipoUsuario: tipoUsuario.CLIENT,
      direcciones: [],
    };
  }

  updateUsuarioMode() {
    this.updateUserState = true;
    this.buttonAddUpdateUser = 'Guardar cambios';

    this.usuarioForm.get('usuariosGroup')?.get('clave')?.clearValidators();

    this.usuarioForm.controls.usuariosGroup.setValue({
      _id: this.usuario._id,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      dni: this.usuario.dni,
      email: this.usuario.email,
      username: this.usuario.username,
      clave: '',
      tipoUsuario: this.usuario.tipoUsuario,
    });

    if (this.usuario.direcciones.length > 0) {
      //relleno el array de direcciones del usuario a modificar
      this.usuario.direcciones.forEach((direccion: any) => {
        this.direcciones.push(direccion);

        this.dataSource.setData([...this.direcciones]);
      });
    }
  }

  addUsuarioMode() {
    this.updateUserState = false;
    this.buttonAddUpdateUser = 'Añadir';

    this.resetUsuarioForm();
  }

  resetDirecciones() {
    this.direcciones = new Array();
  }

  resetDireccionesForm() {
    this.usuarioForm.controls.direccionesGroup.setValue({
      index: '',
      calle: '',
      localidad: '',
      provincia: '',
      cp: '',
    });

    this.usuarioForm.markAsUntouched();
    this.usuarioForm.get('direccionesGroup')?.markAsUntouched();
  }

  addDirMode() {
    this.updateDirState = false;
    this.buttonAddUpdateDir = 'Añadir dirección';

    this.resetDireccionesForm();
  }

  updateDirMode() {
    this.updateDirState = true;
    this.buttonAddUpdateDir = 'Guardar cambios en dirección';
  }
}
