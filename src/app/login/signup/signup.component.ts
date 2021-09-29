import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tipoUsuario, Usuario } from 'src/app/models/usuario';
import { NotificationsService } from 'src/app/notifications.service';
import { UsuariosService } from 'src/app/usuarios/usuarios.service';
import { LoginService } from '../login.service';


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
    private formBuilder:FormBuilder, 
    private route: Router,
    private loginService:LoginService) { 

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
      this.route.navigate(['/login']);
    
    }, (error) => {
   
      //this.abrirErrorDialog(error)
      
    });
    
  }

}
