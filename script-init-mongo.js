use("tienda2");

db.usuarios.drop();
db.categorias.drop();
db.productos.drop();
db.pedidos.drop();


db.usuarios.insertOne({
	_id: ObjectId("61406a2fa8ea81bd1a87d12c"),
	nombre:"Pepe",
	apellido:"Fernandez Gomez",
	dni: "11111111H",
	email:"pepe@gmail.com",
	username:"pepe",
	clave:"pepe",
	tipoUsuario:"Cliente",
	direcciones: [
		{
			calle: "buna vista",
			provincia: "A Coruña",
			localidad: "Santiago de compostla",
			cp: "15701"
		}
	]
});

db.usuarios.insertOne({
	nombre:"Admin",
	apellido:"",
	dni: "11111111H",
	email:"admin@gmail.com",
	username:"admin",
	clave:"admin",
	tipoUsuario:"Administrador",
	direcciones: []
});


db.categorias.insertOne({
	_id:ObjectId("6140692da8ea81bd1a87d12b"), 
	nombre: "Deporte"
});


db.productos.insertOne({
	referencia: "Prod_1",
	titulo: "Producto 1",
	descripcion: "Descripcion producto 1",
	precio: 10.50,
	categoriaId: ObjectId("6140692da8ea81bd1a87d12b")
});

db.pedidos.insertOne({
	numeroPedido: "P00001",
	fecha: "2021-09-14",
	pecioTotal: 21.00,
	pedidoDetalle: [
		{
			cantidad: 2,
			descuento: 0.00,
			refProducto: "P00001",
			tituloProducto: "Producto 1",
			precioUnitario: 10.50,
			precioTotal: 21.00
		}
	],
	cliente:{
		nombre:"Pepe",
		apellido:"Fernandez Gomez",
		dni: "11111111H",
		email:"pepe@gmail.com",
		idUsuario: ObjectId("61406a2fa8ea81bd1a87d12c")
	},
	direccionEntrega: {
		calle: "buna vista",
		provincia: "A Coruña",
		localidad: "Santiago de compostla",
		cp: "15701"
	}
});
