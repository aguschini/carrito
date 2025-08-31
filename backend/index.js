const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Crear producto con imagen
app.post("/productos", upload.single("imagen"), async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { codigo, nombre, descripcion, precio, stock, categoria } = req.body;

    const producto = await prisma.producto.create({
      data: {
        codigo,
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
        categoria,
        imagenUrl: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });

    res.json(producto);
  } catch (error) {
    console.error(" Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});


// Listar productos
app.get("/productos", async (req, res) => {
  const productos = await prisma.producto.findMany();
  res.json(productos);
});

app.listen(4000, () => console.log(" Backend corriendo en http://localhost:4000"));
