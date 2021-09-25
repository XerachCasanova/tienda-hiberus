import { Pipe, PipeTransform } from '@angular/core';


//TODO: RENOMBRARLO DE UNA MANERA MÁS GENÉRICA, YA QUE SIRVE PARA ACOTAR CUALQUIER STRING
@Pipe({
  name: 'descripcion',
})
export class DescripcionPipe implements PipeTransform {
  transform(cadena: string, start: number, end: number): string | null {
    {
      if (cadena == null) {
        return cadena;
      }

      return cadena.length > end
        ? cadena.slice(start, end)
        : cadena.slice(start, cadena.length);
    }

    return null;
  }
}
