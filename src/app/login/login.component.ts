import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private router:Router
    ) { 
    
    this.userLogin = {
      username: '',
      clave: ''
    }

    this.userLoginForm = this.formBuilder.group({});


  }

  ngOnInit(): void {
    
    let token = sessionStorage.getItem('tiendaXerach');

    console.log(token);
    if (token){
      this.router.navigate(['/panel/pedidos']);
    }

    this.userLoginForm = this.formBuilder.group(this.userLogin);

    this.userLoginForm.get('username')?.setValidators(Validators.required);
    this.userLoginForm.get('clave')?.setValidators(Validators.required);

  }

  login(){


    this.userLogin = this.userLoginForm.value;
    this.loginService.login(this.userLogin).subscribe((data:any) => {
      
      if(data.token){

        sessionStorage.setItem('tiendaXerach', JSON.stringify(data.token));
        this.router.navigate(['/panel/pedidos']);

      } else {
        
        this.notificationsService.openNotification('Usuario o contraseña incorrectos.')

      }

    });

  }

}
