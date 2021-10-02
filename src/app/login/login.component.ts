import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationsService } from '../notifications.service';
import { LoginService } from './login.service';


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
    private notificationsService:NotificationsService,
    private formBuilder:FormBuilder,
    private loginService:LoginService,
    private router:Router,

    //Se abre como dialog cuando se accede desde el front office y normal cuando se accede desde el panel
    @Optional() @Inject(MAT_DIALOG_DATA) public dialog: any,
    @Optional() public dialogRef: MatDialogRef<LoginComponent>,
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

        this.dialog.isDialog ? this.dialogRef.close(): this.router.navigate(['/panel/pedidos']);

      } else {
        
        this.notificationsService.openNotification('Usuario o contraseña incorrectos.')

      }

    });

  }

}
