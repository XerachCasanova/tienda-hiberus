import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErroresComponent } from '../errores/errores/errores.component';
import { ErroresService } from '../errores/errores/errores.service';
import { NotificationsService } from '../notifications.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginService } from './login.service';
import { SignupComponent } from './signup/signup.component';


interface UserLogin{
  username: string,
  clave: string,
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  userLogin!:UserLogin;
  userLoginForm: FormGroup;
  token!: string;

  constructor(
    public dialogErrores:MatDialog,
    public dialogSignUp:MatDialog,
    private formBuilder:FormBuilder,
    private loginService:LoginService,
    private router:Router,
    private usuariosService: UsuariosService,

    //Se abre como dialog cuando se accede desde el front office y normal cuando se accede desde el panel
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogLogin: any,
    @Optional() public dialogRefLogin: MatDialogRef<LoginComponent>,
    ) { 


    this.userLogin = {
      username: '',
      clave: ''
    }

    this.userLoginForm = this.formBuilder.group({});

  }

  ngOnInit(): void {

    let token = sessionStorage.getItem('tiendaXerach');

    //comprobamos el token y si es válido redirigimos a pedidos
    //TODO: no redirigir si es dialog.

    if (token){
      this.router.navigate(['/panel/pedidos']);
    }

    this.userLoginForm = this.formBuilder.group(this.userLogin);

    this.userLoginForm.get('username')?.setValidators(Validators.required);
    this.userLoginForm.get('clave')?.setValidators(Validators.required);

  }

  login(){

    //comprobamos el token devuelto por el servio y almacenamos en sesión y redirigimos.

    this.userLogin = this.userLoginForm.value;
    this.loginService.login(this.userLogin).subscribe((data:any) => {
      
      if(data.token){
        
        
        sessionStorage.setItem('tiendaXerach', JSON.stringify(data.token));
      
        //Guardamos también el payload una vez verificado el token.
        this.usuariosService.verifyUser().subscribe((user:any) => {

          sessionStorage.setItem('payload', JSON.stringify(user.datosSecretos));
 
      
        })

        //Si es un dialog, lo cierra y si no lo es, redirige a una página del panel.

        this.dialogLogin.isDialog ? this.dialogRefLogin.close(true): this.router.navigate(['/panel/pedidos']);

      } else {
        
        
        this.abrirFormErrorsDialog('Usuario o contraseña incorrectos');

      }

    });

    
  }

  abrirFormErrorsDialog(error:string) {
     this.dialogErrores.open(ErroresComponent, { 
      width: '350px',
      height: '200px',
      data: { type: 'customError', msg: error },
    });

  }

  abrirSignUpDialog() {
    
    
    const dialogRef = this.dialogSignUp.open(SignupComponent, { 
      width: '500px',
      height: '400px'
    });


  }

  cancelLogin(){

    this.dialogRefLogin.close(false);

  }


}
