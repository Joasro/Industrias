const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./config/db.js');
const passport = require('./config/passport.js');


const Empresa = require('./models/empresa.js');
const EncuestaDemanda = require('./models/encuestaDemanda.js');
const EventoSector = require('./models/EventoSector.js');
const IndicadorEconomico = require('./models/indicadorEconomico.js');
const Pais = require('./models/pais.js');
const ProductoServicio = require('./models/productoservicio.js');
const RegistroAcceso = require('./models/registroAcceso.js');
const TendenciaTecnologica = require('./models/tendenciatecnologica.js');
const Usuario = require('./models/usuario.js');
const multer = require('multer');

const { swaggerUi, swaggerSpec } = require('./config/swagger.js');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Sincronización de modelos
db.authenticate()
    .then(async () => {
        console.log('Base de datos conectada correctamente');
        await Pais.sync()
            .then(() => {
                console.log('Modelo Pais sincronizado');
            })
            .catch((err)=> {
                console.error('Error al sincronizar el modelo Pais:', err);
            });
        await Empresa.sync()
            .then(() => {
                console.log('Modelo Empresa sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo Empresa:', err);
            });
        await ProductoServicio.sync()
            .then(() => {
                console.log('Modelo ProductoServicio sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo ProductoServicio:', err);
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
        await IndicadorEconomico.sync()
            .then(() => {
                console.log('Modelo IndicadorEconomico sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo IndicadorEconomico:', err);
            });
        await EventoSector.sync()
            .then(() => {
                console.log('Modelo EventoSector sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo EventoSector:', err);
            });
        await RegistroAcceso.sync()
            .then(() => {
                console.log('Modelo RegistroAcceso sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo RegistroAcceso:', err);
            });
        await EncuestaDemanda.sync()
            .then(() => {
                console.log('Modelo EncuestaDemanda sincronizado');
            })
            .catch((err) => {
                console.error('Error al sincronizar el modelo EncuestaDemanda:', err);
            });
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

app.set('port', process.env.PORT || 3000);
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

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Solo se permiten imágenes')) {
    return res.status(400).json({ error: err.message });
  }

  // Mostrar mensaje y stack si estamos en desarrollo
  console.error('Error no controlado:', err);

  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    stack: err.stack
  });
});

app.listen(app.get('port'), () => {
  console.log('Servidor iniciado en el puerto ' + app.get('port'));
});
