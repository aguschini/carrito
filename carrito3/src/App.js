import { useState } from "react";
import './App.css';

function App() {
  // Datos de prueba (luego se reemplazan por datos del servidor)
  const [productos, setProductos] = useState([
    { 
      codigo: "00123", 
      nombre: "Yerba Mate",
      descripcion: "Amarga", 
      precio: 2500, 
      stock: 30, 
      categoria: "Alimentos",
      imagen: "imagenes/playadito.jpg"
    },
    { 
      codigo: "00456", 
      nombre: "Café Tostado",
      descripcion: "Premium", 
      precio: 3400, 
      stock: 12, 
      categoria: "Alimentos",
      imagen: "imagenes/nescafe.jpg" 
    },
    { 
      codigo: "00789", 
      nombre: "Galletitas",
      descripcion: "Saladas",  
      precio: 1200, 
      stock: 50, 
      categoria: "Snacks",
      imagen: "imagenes/formis.jpg" 
    }
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '', nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: ''
  });
  const [productoEditando, setProductoEditando] = useState(null); // índice del producto en edición

  const guardarProducto = () => {
    if (productoEditando !== null) {
      // EDITAR
      const copia = [...productos];
      copia[productoEditando] = nuevoProducto;
      setProductos(copia);
    } else {
      // AGREGAR
      setProductos([...productos, nuevoProducto]);
    }
    // resetear
    setNuevoProducto({ codigo: '', nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: '' });
    setProductoEditando(null);
    setMostrarModal(false);
  };

  const abrirEditar = (index) => {
    setNuevoProducto(productos[index]);   // cargar datos del producto
    setProductoEditando(index);           // guardar índice
    setMostrarModal(true);
  };

  return (
    
    <div className="App min-h-screen bg-gray-100"> {/* formato pagina */}
      
      {/* ENCABEZADO */}
      <header className="bg-[#293241] text-white text-center text-4xl p-10 font-serif">
        <h1>Carrito de Compras</h1>
      </header>

      {/* BOTÓN AGREGAR */}
      <div className="p-6 text-left">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow" 
          onClick = {() => setMostrarModal(true)}>
          + Agregar Producto
        </button>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="px-6">
        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="p-3 border">Imagen</th>              
              <th className="p-3 border">Código</th>
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Descripción</th>
              <th className="p-3 border">Precio</th>
              <th className="p-3 border">Stock</th>
              <th className="p-3 border">Categoría</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-3 border text-center">
                  <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover mx-auto rounded" />
                </td>
                <td className="p-3 border">{p.codigo}</td>
                <td className="p-3 border">{p.nombre}</td>
                <td className="p-3 border">{p.descripcion}</td>
                <td className="p-3 border">${p.precio}</td>
                <td className="p-3 border">{p.stock}</td>
                <td className="p-3 border">{p.categoria}</td>
                <td className="p-3 border">
                  <button className="text-blue-600 hover:underline mr-3" onClick={() => abrirEditar(i)}>Editar</button>
                  <button className="text-red-600 hover:underline">Bloquear</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL AGREGAR PRODUCTO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Agregar Producto</h2>
            
            <input type="text" placeholder="Código" className="border p-2 w-full mb-2"
              value={nuevoProducto.codigo}
              onChange={(e) => setNuevoProducto({...nuevoProducto, codigo: e.target.value})}
            />
            <input type="text" placeholder="Nombre" className="border p-2 w-full mb-2"
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
            />
            <input type="text" placeholder="Descripción" className="border p-2 w-full mb-2"
              value={nuevoProducto.descripcion}
              onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
            />
            <input type="number" placeholder="Precio" className="border p-2 w-full mb-2"
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
            />
            <input type="number" placeholder="Stock" className="border p-2 w-full mb-2"
              value={nuevoProducto.stock}
              onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})}
            />
            <input type="text" placeholder="Categoría" className="border p-2 w-full mb-2"
              value={nuevoProducto.categoria}
              onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const archivo = e.target.files[0]; // tomo el primer archivo elegido
                if (archivo) {
                  const urlTemp = URL.createObjectURL(archivo); 
                  // crea una URL temporal para mostrar la imagen
                  setNuevoProducto({ ...nuevoProducto, imagen: urlTemp });
                }
              }}
            />
          <div className="mb-6"></div>

            <div className="flex justify-end">
              <button className="bg-gray-300 px-4 py-2 rounded mr-2" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={guardarProducto}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

