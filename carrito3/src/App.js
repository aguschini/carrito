import React, {useState, useEffect } from "react";
import './App.css';

function App() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '', nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: null
  });
  const [productoEditando, setProductoEditando] = useState(null);
  const [preview, setPreview] = useState(null); // para mostrar preview de la imagen seleccionada
  
  // Estado para guardar productos
  const [productos, setProductos] = useState([]);

  // useEffect para cargar los productos desde el backend al iniciar
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("http://localhost:4000/productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, []);

  // 🚀 Guardar producto en backend
  const guardarProducto = async () => {
    try {
      const formData = new FormData();
      formData.append("codigo", nuevoProducto.codigo);
      formData.append("nombre", nuevoProducto.nombre);
      formData.append("descripcion", nuevoProducto.descripcion);
      formData.append("precio", nuevoProducto.precio);
      formData.append("stock", nuevoProducto.stock);
      formData.append("categoria", nuevoProducto.categoria);
      if (nuevoProducto.imagen) {
        formData.append("imagen", nuevoProducto.imagen); // archivo real
      }

      const res = await fetch("http://localhost:4000/productos", {
        method: "POST",
        body: formData,
      });


      if (!res.ok) throw new Error("Error al guardar producto");

      const productoCreado = await res.json();

      // Actualizar lista local
      if (productoEditando !== null) {
        const copia = [...productos];
        copia[productoEditando] = productoCreado;
        setProductos(copia);
      } else {
        setProductos([...productos, productoCreado]);
      }

      // resetear
      setNuevoProducto({ codigo: '', nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: null });
      setPreview(null);
      setProductoEditando(null);
      setMostrarModal(false);
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar el producto");
    }
  };

  const abrirEditar = (index) => {
    setNuevoProducto(productos[index]);
    setProductoEditando(index);
    setMostrarModal(true);
  };

  return (
    <div className="App min-h-screen bg-gray-100">
      {/* ENCABEZADO */}
      <header className="bg-[#293241] text-white text-center text-4xl p-10 font-serif">
        <h1>Carrito de Compras</h1>
      </header>

      {/* BOTÓN AGREGAR */}
      <div className="p-6 text-left">
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow" 
          onClick={() => setMostrarModal(true)}>
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
                  <img src={`http://localhost:4000${p.imagenUrl}`} alt={p.nombre} className="w-16 h-16 object-cover mx-auto rounded" />
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

            {/* Input para imagen */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const archivo = e.target.files[0];
                if (archivo) {
                  setNuevoProducto({ ...nuevoProducto, imagen: archivo });
                  setPreview(URL.createObjectURL(archivo));
                }
              }}
              className="mb-2"
            />

            {preview && (
              <img src={preview} alt="preview" className="w-20 h-20 object-cover rounded mb-2" />
            )}

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
