import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../models/categoria';
import { CategoriasService } from './categorias.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent implements OnInit {
  listadoCategorias: any;

  updateState: boolean;
  buttonAddUpdate: string;

  formGroup: FormGroup;

  constructor(
    private categoriasService: CategoriasService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({});

    this.updateState = false;

    this.buttonAddUpdate = 'Añadir';
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      _id: [''],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.buildForm();
  }

  private listarCategorias() {
    this.listadoCategorias = this.categoriasService.getCategorias();
  }

  insertarModificarCategoria() {
    let request;
    if (!this.updateState) {
      request = this.categoriasService.insertCategoria(this.formGroup.value);
    } else {
      request = this.categoriasService.updateCategoria(this.formGroup.value);
    }

    request.subscribe((data) => {
      this.listarCategorias();
    });

    this.reset();
  }

  eliminarCategoria(categoriaToDelete: Categoria) {
    this.categoriasService
      .deleteCategoria(categoriaToDelete)
      .toPromise()
      .then((data) => {
        this.listarCategorias();
      });
  }

  modificarCategoria(categoriaToUpdate: Categoria) {
    this.updateState = true;

    this.categoriasService
      .findCategoria(categoriaToUpdate)
      .subscribe((data) => {
        this.formGroup.setValue(data);
        this.buttonAddUpdate = 'Guardar';
      });
  }

  reset() {
    this.updateState = false;
    this.buttonAddUpdate = 'Añadir';

    this.formGroup.setValue({
      _id: '',
      nombre: '',
    });
  }
}
