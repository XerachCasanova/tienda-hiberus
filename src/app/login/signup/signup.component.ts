import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErroresComponent } from 'src/app/errores/errores/errores.component';
import { ErroresService } from 'src/app/errores/errores/errores.service';
import { tipoUsuario, Usuario } from 'src/app/models/usuario';
import { NotificationsService } from 'src/app/notifications.service';
import { UsuariosService } from 'src/app/usuarios/usuarios.service';
import { LoginService } from '../login.service';

//TODO: añadir al entorno del front.

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  

  usuario!: Usuario;
  userSignUpForm: FormGroup;

  constructor(
    private notificationsService: NotificationsService,
    public dialogErrores:MatDialog,
    private formBuilder:FormBuilder, 
    private route: Router,
    private loginService:LoginService,
    @Inject(MAT_DIALOG_DATA) public dialogSignUp: any,
   public dialogRef: MatDialogRef<SignupComponent>,) { 

    this.userSignUpForm = this.formBuilder.group({});

    this.usuario = {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      tipoUsuario: tipoUsuario.CLIENT,
      direcciones: [],
      username: '',
      clave :'',
    }


  }

  ngOnInit(): void {

    this.userSignUpForm = this.formBuilder.group(this.usuario);

    this.userSignUpForm.get('nombre')?.setValidators(Validators.required);
    this.userSignUpForm.get('apellido')?.setValidators(Validators.required);
    this.userSignUpForm.get('dni')?.setValidators(Validators.required);
    this.userSignUpForm.get('email')?.setValidators(Validators.required);
    this.userSignUpForm.get('username')?.setValidators(Validators.required);
    this.userSignUpForm.get('clave')?.setValidators(Validators.required);
  }

  signUp(){
    

    this.usuario = this.userSignUpForm.value;

    this.loginService.signUp(this.usuario).subscribe(data => {
      this.notificationsService.openNotification('Te has registrado correctamente.');
      
      this.route.navigate(['/']);

      this.dialogRef.close({signUp: true});

    
    }, (error) => {
       
     
      this.abrirFormErrorsDialog(error)
      
    });
    
  }

  abrirFormErrorsDialog(error:any) {
    this.dialogErrores.open(ErroresComponent, { 
     width: '350px',
     height: '300px',
     data: { error },
   });

 }

  cancel(){
    this.dialogRef.close({signUp: false});
  }

}
