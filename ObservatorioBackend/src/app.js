const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');  
const { opts } = require('./config/passport.js');
const { JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const cors = require('cors');

const db = require('./config/db.js');


const Empresa = require('./models/empresa.js');
const EncuestaDemanda = require('./models/encuestaDemanda.js');
const EventoSector = require('./models/eventoSector.js');
const IndicadorEconomico = require('./models/indicadorEconomico.js');
const Pais = require('./models/pais.js');
const ProductoServicio = require('./models/productoServicio.js');
const RegistroAcceso = require('./models/registroAcceso.js');
const TendenciaTecnologica = require('./models/tendenciatecnologica.js');
const Usuario = require('./models/usuario.js');
const multer = require('multer');

const { swaggerUi, swaggerSpec } = require('./config/swagger.js');

const app = express();
// Habilitar CORS para el frontend
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Seed de datos iniciales (solo si está vacío)
async function seedInitialData() {
  try {
    const paisesCount = await Pais.count();
    if (paisesCount === 0) {
      await Pais.bulkCreate([
        { codigo_pais: 'HND', nombre: 'Honduras', pbi_tech: 0, num_empresas_software: 0, exportaciones_ti: 0 },
        { codigo_pais: 'GTM', nombre: 'Guatemala', pbi_tech: 0, num_empresas_software: 0, exportaciones_ti: 0 },
        { codigo_pais: 'CRI', nombre: 'Costa Rica', pbi_tech: 0, num_empresas_software: 0, exportaciones_ti: 0 },
      ]);
      console.log('Seed: países iniciales insertados');
    }
  } catch (err) {
    console.error('Error durante el seed inicial:', err);
  }
}

//Sincronización de modelos
db.authenticate()
    .then(async () => {
        console.log('Base de datos conectada correctamente');
        
        // 1. Primero las tablas sin dependencias
        await Pais.sync()
            .then(() => {
                console.log('Modelo Pais sincronizado');
            })
            .catch((err)=> {
                console.error('Error al sincronizar el modelo Pais:', err);
            });
            
        await TendenciaTecnologica.sync()
            .then(() => {
                console.log('Modelo TendenciaTecnologica sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo TendenciaTecnologica:', err);
            });
            
        await Usuario.sync()
            .then(() => {
                console.log('Modelo Usuario sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo Usuario:', err);
            });
            
        // 2. Luego las tablas que dependen de las anteriores
        await Empresa.sync()
            .then(() => {
                console.log('Modelo Empresa sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo Empresa:', err);
            });
            
        // 3. Tablas que dependen de Empresa
        await ProductoServicio.sync()
            .then(() => {
                console.log('Modelo ProductoServicio sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo ProductoServicio:', err);
            });
            
        await EventoSector.sync()
            .then(() => {
                console.log('Modelo EventoSector sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo EventoSector:', err);
            });
            
        // 4. Tablas que dependen de otras tablas
        await IndicadorEconomico.sync()
            .then(() => {
                console.log('Modelo IndicadorEconomico sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo IndicadorEconomico:', err);
            });
            
        await RegistroAcceso.sync()
            .then(() => {
                console.log('Modelo RegistroAcceso sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo RegistroAcceso:', err);
            });
            
        // 5. Última tabla que depende de ProductoServicio
        await EncuestaDemanda.sync()
            .then(() => {
                console.log('Modelo EncuestaDemanda sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo EncuestaDemanda:', err);
            });

        // Ejecutar seed al final de la sincronización
        await seedInitialData();
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

app.set('port', process.env.PORT || 3001);
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api', require('./routes/index.js'));
app.use('/api/pais', require('./routes/rutasPais.js'));
app.use('/api/empresa', require('./routes/rutasEmpresa.js'));
app.use('/api/tendencia-tecnologica', require('./routes/rutasTendenciaTecnologica.js'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


app.listen(app.get('port'), () => {
  console.log('Servidor iniciado en el puerto ' + app.get('port'));
});
