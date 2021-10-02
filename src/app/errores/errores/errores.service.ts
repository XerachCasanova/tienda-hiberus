import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ErroresService {

  constructor() { }

  manageError(data:any){
    
    console.log(data)
    
    if(data.error && data.error.status) {
  
      return data.error.error.errors.map((error:any) => error.msg);
      
    } else {
      
      return [data.msg]

    }
  }
}
