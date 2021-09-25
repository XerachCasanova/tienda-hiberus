import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { Categoria } from 'src/app/models/categoria';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-productos-form',
  templateUrl: './productos-form.component.html',
  styleUrls: ['./productos-form.component.css'],
})
export class ProductosFormComponent {
  //flags para gestionar el modo modificar o añadir.
  updateProductState!: boolean;
  buttonAddUpdateProduct!: string;

  productoForm: FormGroup;

  categorias!: Categoria[];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProductosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public producto: Producto,
    private categoriasService: CategoriasService
  ) {
    this.productoForm = this.formBuilder.group({});
    this.categoriasService
      .getCategorias()
      .subscribe((data: any) => (this.categorias = data));
  }

  ngOnInit(): void {
    this.buildForm();
    this.producto._id ? this.updateProductoMode() : this.addProductoMode();
  }

  private buildForm() {
    this.productoForm = this.formBuilder.group({
      _id: [''],
      referencia: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: [''],
      precio: [0],
      categoriaId: [''],
    });
  }

  save() {
    //Guardamos en producto todo el formulario y lo enviamos al componente lista
    this.producto = {
      ...this.productoForm.value,
    };

    this.dialogRef.close(this.producto);
  }

  reset() {
    this.resetProducto();

    this.buildForm();

    this.dialogRef.close();
  }

  resetProducto() {
    this.producto = {
      _id: '',
      referencia: '',
      titulo: '',
      descripcion: '',
      precio: 0,
      categoriaId: '',
    };
  }

  updateProductoMode() {
    this.updateProductState = true;
    this.buttonAddUpdateProduct = 'Guardar cambios';

    //asignamos la id a la categoría.
    let categoria;
    if ('_id' in this.producto.categoriaId) {
      categoria = this.producto.categoriaId._id;
    }

    this.productoForm.setValue({
      _id: this.producto._id,
      referencia: this.producto.referencia,
      titulo: this.producto.titulo,
      descripcion: this.producto.descripcion,
      precio: this.producto.precio,
      categoriaId: categoria,
    });
  }

  addProductoMode() {
    this.updateProductState = false;
    this.buttonAddUpdateProduct = 'Añadir';

    this.buildForm();
  }
}
