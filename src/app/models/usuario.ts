export interface Usuario {
  _id?: string;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  username: string;
  clave: string;
  tipoUsuario: tipoUsuario;
  direcciones: any;
}

export enum tipoUsuario {
  ADMIN = 'Administrador',
  CLIENT = 'Cliente',
}
