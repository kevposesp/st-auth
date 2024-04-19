# st-auth

## Descripción
`st-auth` es un paquete de autenticación y gestión de usuarios para proyectos con Express. Proporciona funcionalidades como registro, autenticación, visualización y actualización de perfiles de usuario.

## Instalación
Para instalar `st-auth` en tu proyecto de Express, ejecuta el siguiente comando:

```bash
npm install st-auth
```

## Uso
Primero, asegúrate de sincronizar la base de datos utilizando el método dbSync():
```javascript
const stAuth = require("st-auth");
stAuth.dbSync();
```

Luego, carga las rutas de autenticación en tu aplicación Express:
```javascript
const express = require("express");
const app = express();

const stAuth = require("st-auth");
stAuth.routes(app);
```

No olvides configurar las variables de entorno en tu archivo .env:
```
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=@Admin123
DB_DB=tumb
DB_PORT=3306

# Auth
SECRET=tumb-secret-key
EXPIRATION=3600
REFRESH_EXPIRATION=86400
```

## Ejemplo de uso
Aquí hay un ejemplo básico de cómo usar st-auth en tu aplicación Express:

```javascript
const express = require("express");
const cors = require("cors");
const app = express();

const stAuth = require("st-auth");
stAuth.dbSync();

// Configuración de la base de datos
const db = require("./models");
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
})

// Configuración del CORS
var corsOptions = {
  origin: process.env.CORSURL || "http://localhost:4200",
};
app.use(cors(corsOptions));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Carga de rutas de autenticación
stAuth.routes(app);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
```

## Contribución
Actualmente, no se aceptan contribuciones. Sin embargo, en futuras versiones se contemplará la posibilidad de contribuir al proyecto.

## Créditos
st-auth fue creado por kevposesp. Sin embargo, en un futuro próximo, se espera que se añadan más contribuyentes al proyecto. Si estás interesado en contribuir, no dudes en ponerte en contacto.

## Licencia
Este paquete es de código abierto y se distribuye bajo la Licencia MIT.

## Estado del Proyecto
st-auth se encuentra actualmente en desarrollo. La versión 0.2.0 proporciona funcionalidades básicas, pero se espera que la versión 1.0.0 tenga muchas más características.