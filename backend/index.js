import express from "express";
import mysql from "mysql";
import multer from "multer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 30005;

// Carpeta donde se guardarán las imágenes
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Servir imágenes de la carpeta uploads
app.use("/uploads", express.static(uploadFolder));

// Conexión a MySQL
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "cinco",
    password: "cinco",
    database: "cinco"
});

con.connect((err) => {
    if (err) throw err;
    console.log("Conectado a MySQL");
});

// Rutas MySQL
app.get("/", (req, res) => {
    con.query("SELECT * FROM sujeto", (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

app.get("/id/:id", (req, res) => {
    const c = req.params;
    con.query("SELECT * FROM sujeto WHERE id=" + c.id, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

// Ruta para subir imágenes
app.post("/upload", upload.single("foto"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No se subió ningún archivo" });
    }
    res.json({ mensaje: "Archivo subido", nombre: req.file.filename });
});

// Ruta para borrar imágenes
app.delete("/delete/:filename", (req, res) => {
    const filePath = path.join(uploadFolder, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ mensaje: "Archivo borrado" });
    } else {
        res.status(404).json({ error: "Archivo no encontrado" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
