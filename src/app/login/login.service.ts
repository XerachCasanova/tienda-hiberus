import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  urlBase: string;

  constructor(private httpClient: HttpClient) { 

    this.urlBase = environment.urlBase + 'login/';


  }
  
  login(userLogin: any) {

    return this.httpClient.post(this.urlBase, userLogin) ;
  }

  signUp(user: Usuario) {
    
    let url = this.urlBase + 'signup'
    return this.httpClient.post(url, user) ;
  }



}
