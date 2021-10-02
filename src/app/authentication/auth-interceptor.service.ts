import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private router:Router){} 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if(this.router.url == '/login/signup'){
      return next.handle(req);
    }

    const token = sessionStorage.getItem('tiendaXerach');
    
    let modifiedRequest = req;

    if(token) {
      const tokenParsed = JSON.parse(token);

      modifiedRequest = req.clone( {
        setHeaders: {
          authorization: `Bearer ${ tokenParsed }`
        }
      });
    }
    
    return next.handle(modifiedRequest).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error:any)
  {
    
    const codigo = 401;
  

    if(error instanceof HttpErrorResponse)
    {

      if(error.status == codigo) {
        sessionStorage.removeItem('tiendaXerach')
     

      }
      if(error.status==500) {

        sessionStorage.removeItem('tiendaXerach')
        
      }
      else{
        //TODO: FALTA IMPLEMENTAR BIEN TODOS LOS ERRORES DEVUELTOS.
      }
    }
  
    return throwError(error);
  }
  
}


