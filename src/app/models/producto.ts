import { Categoria } from './categoria';

export interface Producto {
  _id?: string;
  titulo: string;
  referencia: string;
  descripcion: string;
  precio: number;
  categoriaId: Categoria | String;
}
