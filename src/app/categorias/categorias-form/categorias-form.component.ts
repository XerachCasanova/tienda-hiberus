import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/models/categoria';

@Component({
  selector: 'app-categorias-form',
  templateUrl: './categorias-form.component.html',
  styleUrls: ['./categorias-form.component.css'],
})
export class CategoriasFormComponent {
  updateCategoryState!: boolean;

  buttonAddUpdateCategory!: string;

  categoriaForm: FormGroup;
  categorias!: Categoria[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CategoriasFormComponent>,
    @Inject(MAT_DIALOG_DATA) public categoria: Categoria
  ) {
    this.categoriaForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.buildForm();
    this.categoria._id ? this.updateCategoriaMode() : this.addCategoriaMode();
  }

  private buildForm() {
    this.categoriaForm = this.formBuilder.group({
      _id: [''],
      nombre: ['', Validators.required],
    });
  }

  save() {
    //Elimino el campo index antes de enviar a la bd, ya que solo es un indicador para el array direcciones

    this.categoria = {
      ...this.categoriaForm.value,
    };

    this.dialogRef.close(this.categoria);
  }

  reset() {
    this.resetProducto();

    this.buildForm();

    this.dialogRef.close();
  }

  resetProducto() {
    this.categoria = {
      _id: '',
      nombre: '',
    };
  }

  updateCategoriaMode() {
    this.updateCategoryState = true;
    this.buttonAddUpdateCategory = 'Guardar cambios';

    this.categoriaForm.setValue({
      _id: this.categoria._id,
      nombre: this.categoria.nombre,
    });
  }

  addCategoriaMode() {
    this.updateCategoryState = false;
    this.buttonAddUpdateCategory = 'Añadir';

    this.buildForm();
  }
}
