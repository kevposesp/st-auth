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
const db = require("./models");

// Configuración de tu base de datos
stAuth.dbSync(true)
db.sequelize.sync({ force: true })

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

// Tus rutas
require("./routes/otras.routes")(app);

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
```

## Uso de middleware en las rutas de tu proyecto
```javascript
// Requerimos el paquete e importamos los middlewares que necesitemos
const { verifyToken, verifyPermission } = require("st-auth");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/createPermission", 
        [
            verifyToken,// Uso de middleware del token (x-access-token)
            verifyPermission(["createPermission"])// Uso de middleware, comprobación si el usuario puede ejecutar la funcion
        ],
        function (req, res) {
            console.log("Create Permission");
            res.send("Create Permission");
        }
    );
}
```

## Rutas
```javascript
// User
  // Register
  (Post)http://localhost:3000/user/register
  (body)
    {
      "username": "",
      "email": "",
      "password": ""
    }
  (optional)
    {
      name = null,
      address = null,
      note = null,
      phone = null,
      secondPhone = null,
      enableLog = true,
      status = 1
    }
  
  // Login
  (Post)http://localhost:3000/user/login
  (body)
    {
      "user": "st_admin",
      "password": "st_admin"
    }

  // Profile ST
  (Get)http://localhost:3000/user
  (headers)x-access-token: {{Token}}

  // Update profile
  (Put)http://localhost:3000/user/update
  (headers)x-access-token: {{Token}}
  (body-optional)
    {
      name,
      email,
      address,
      note,
      phone,
      secondPhone,
      username,
      enableLog,
      status
    }
  
  // AddOrRemoveRole
  (Post)http://localhost:3000/user/addOrRemoveRole/{{idUser}}
  (headers)x-access-token: {{Token}}
  (MiddlewarePermission): "addOrRemoveRole"
  (body)
    {
      "roleId": ""
    }
  
// Permission
  // Create permission
  (Post)http://localhost:3000/permission/create
  (headers)x-access-token: {{Token}}
  (MiddlewarePermission): "createPermission"
  (body)
    {
      "name": ""
    }

  // Get all permissions
  (Get)http://localhost:3000/permission/all
  (headers)x-access-token: {{Token}}
  (MiddlewarePermission): "readPermission"

  // Update permission
  (Put)http://localhost:3000/permission/update/{{idPermission}}
  (headers)x-access-token: {{Token}}
  (MiddlewarePermission): "updatePermission"
  (body)
    {
      "name": ""
    }
  
  // Delete permission
  (Delete)http://localhost:3000/permission/update/{{idPermission}}
  (headers)x-access-token: {{Token}}
  (MiddlewarePermission): "deletePermission"

// Role
  // Create role
  (Post)http://localhost:3000/role/create
  (headers)x-access-token: {{Token}}
  (MiddlewareRole): "createRole"
  (body)
    {
      "name": ""
    }

  // Get all roles
  (Get)http://localhost:3000/role/all
  (headers)x-access-token: {{Token}}
  (MiddlewareRole): "readRole"

  // Update role
  (Put)http://localhost:3000/role/update/{{idRole}}
  (headers)x-access-token: {{Token}}
  (MiddlewareRole): "updateRole"
  (body)
    {
      "name": ""
    }
  
  // Delete role
  (Delete)http://localhost:3000/role/update/{{idRole}}
  (headers)x-access-token: {{Token}}
  (MiddlewareRole): "deleteRole"

  // AddOrRemovePermission to role
  (Post)http://localhost:3000/role/addOrRemovePermission/{{idRole}}
  (headers)x-access-token: {{Token}}
  (MiddlewareRole): "addOrRemovePermission"
  (body)
    {
      "name": ""
    }

```

## Models
(Ejemplo de relaciones entre tus modelos y los de st-auth)
```javascript
// Importamos el modelo user y sequelize para el mismo uso de conexión a bbdd
const { user, Sequelize, sequelize } = require("st-auth/models")

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Requerimos el modelo y lo creamos pasandole la conexión
db.profile = require("./profile.model.js")(sequelize, Sequelize);

// Guardamos el user de st-auth en db.user
db.user = user;

// Creamos la relacion un perfil pertenece a un usuario y un usuario puede tener varios perfiles
db.profile.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
});

db.user.hasMany(db.profile, { as: "profiles" });

module.exports = db;
```

## Model Profile Ejemplo
```javascript
module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profiles", {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        }
    });
    return Profile;
}
```

## Contribución
Actualmente, no se aceptan contribuciones. Sin embargo, en futuras versiones se contemplará la posibilidad de contribuir al proyecto.

## Créditos
st-auth fue creado por kevposesp. Sin embargo, en un futuro próximo, se espera que se añadan más contribuyentes al proyecto. Si estás interesado en contribuir, no dudes en ponerte en contacto.

## Licencia
Este paquete es de código abierto y se distribuye bajo la Licencia MIT.

## Estado del Proyecto
st-auth se encuentra actualmente en desarrollo. La versión 0.2.0 proporciona funcionalidades básicas, pero se espera que la versión 1.0.0 tenga muchas más características.