import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErroresService } from './errores.service';

@Component({
  selector: 'app-errores',
  templateUrl: './errores.component.html',
  styleUrls: ['./errores.component.css']
})
export class ErroresComponent implements OnInit {
  
  errores = new Array();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private erroresService:ErroresService,
    public dialogRef: MatDialogRef<ErroresComponent>
    
    ) { }

  ngOnInit(): void {
    
    this.errores = this.erroresService.manageError(this.data.errores);
 
  }

}
