export interface PedidoDetalle {
  cantidad: number;
  descuento: number;
  refProducto: string;
  tituloProducto: string;
  precioUnitario: number;
  precioTotal: number;
}

export interface Pedido {
  _id?: string;
  numeroPedido: string;
  fecha: Date;
  precioTotal: number;
  pedidoDetalle: PedidoDetalle[];
  cliente: {
    idUsuario: string;
    nombre: string;
    apellido: string;
    email: string;
    dni: string;
  };
  direccionEntrega: {
    _id?: string;
    calle: string;
    localidad: string;
    provincia: string;
    cp: string;
  };
}
