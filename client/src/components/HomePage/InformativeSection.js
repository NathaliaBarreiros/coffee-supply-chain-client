import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Grid, Card, CardHeader, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import '../../App.css';

const bull = (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>
    •
  </Box>
);

const InformativeSection = () => {
  const theme = useTheme();
  return (
    <div id="about" className="max-w-6xl mx-auto">
      <Grid container>
        <div className="grid mx-16 grid-cols-1 lg:grid-cols-2 gap-x-10">
          <div className="lg:col-span-2 ">
            <Typography
              variant="h6"
              className="title-home"
              sx={{
                color: theme.palette.secondary.main,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Nuestro SISTEMA DE TRACKING está construido sobre la tecnología BLOCKCHAIN
            </Typography>
          </div>
          <div className="p-5">
            <Card sx={{ boxShadow: 3 }} className="about-card">
              <CardMedia
                component="img"
                height="270"
                image="https://cdn.techwireasia.com/wp-content/uploads/2021/01/shutterstock_1079935373-897x500.png"
                alt="blockchain technology"
              />
              <CardHeader title="¿Qué es la tecnología blockchain?" />

              <CardContent>
                <Typography variant="body2" className="about-info">
                  La cadena de bloques o blockchain es un libro mayor digital replicado, distribuido, compartido e
                  inmutable que permite realizar transacciones seguras entre dos participantes sin autoridad central,
                  registrar el proceso de transacciones y el seguimiento de activos en una red de negocios. Blockchain
                  utiliza contratos inteligentes para codificar la lógica de negocio relacionada con el intercambio de
                  bienes o servicios, permitiendo la verificación y liquidación de promesas contractuales sin
                  intervención humana.
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="p-5">
            <Card sx={{ boxShadow: 3 }} className="about-card">
              <CardMedia
                component="img"
                height="270"
                image="/static/images/supplychain.png"
                // image="https://ifssportal.nutritionconnect.org/sites/default/files/styles/teaser/public/images/S96.png?itok=s-35oeBz"
                alt="blockchain in traceability on supply chains"
              />
              <CardHeader title="Blockchain en la trazabilidad de cadenas de suministro" />

              <CardContent>
                <Typography variant="body2" className="about-info">
                  A lo largo de la cadena de suministro, blockchain facilita:
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1.5 }}>
                  {bull} Obtener y entregar datos de manera inmediata, compartida y transparente.
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1.5 }}>
                  {bull} Almacenar los datos en un libro mayor distribuido e inalterable.{' '}
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1.5 }}>
                  {bull} Tener una fuente de consulta única para todos los partícipes de la cadena de suministro.
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1.5 }}>
                  {bull}La confianza entre las partes de una cadena de suministro y del cliente final con el proceso.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="mx-auto mt-5">
          <Typography variant="h6" className="title-home2" sx={{ color: theme.palette.tertiary.main }}>
            ¿Cómo funciona <span className="spanInfo">CoffeeTrack</span>?
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-16 gap-10 mb-20">
          <div>
            <Card sx={{ boxShadow: 3 }} className="about-card">
              <CardMedia
                component="img"
                height="194"
                image="https://www.godfatherstyle.com/wp-content/uploads/2022/01/Blockchain-3.png"
                // image="/static/images/smart-contract1.jpg"
              />
              <CardHeader title="1. Contratos inteligentes desplegados en la blockchain" />

              <CardContent>
                <Typography variant="body2" className="about-info">
                  Los contratos inteligentes que permiten realizar el seguimiento del café de especialidad por su cadena
                  de suministro fueron desplegados en la blockchain de prueba de Goerli.
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1 }}>
                  {bull}Puedes consultarlos accediendo a los siguientes enlaces:{' '}
                </Typography>
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 2 }}>
                  <a
                    className="coffee-smart-contract-1 font-bold"
                    href="https://goerli.etherscan.io/address/0x588774DEd56c4395A4b2115931e2B1379d29980d#code"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contrato Trazabilidad 1
                  </a>
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 2 }}>
                  <a
                    className="coffee-smart-contract-2 font-bold"
                    href="https://goerli.etherscan.io/address/0x4213D059E4c1a9830BD41a7830082C9cEE95CcbA#code"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Contrato Trazabilidad 2
                  </a>
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card sx={{ boxShadow: 3 }} className="about-card">
              <CardMedia
                component="img"
                height="194"
                image="https://images.ctfassets.net/9sy2a0egs6zh/6ngCUoU36ABPjs6cDNnuoK/a4b9e978595248dbb685aa2c53e3f4dc/download-extension.png"
                // image="/static/images/metamask.png"
                alt="blockchain technology"
              />
              <CardHeader title="2. Usa la billetera digital de MetaMask para interactuar con los contratos inteligentes" />

              <CardContent>
                <Typography variant="body2" className="about-info">
                  La billetera digital de MetaMask permite interactuar con los contratos inteligentes a través de
                  nuestra aplicación. Todos los usuarios que interactúan con los contratos inteligentes deben ser
                  previamente habilitados para hacerlo.
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1 }}>
                  {bull}Si ya eres usuario de nuestra aplicación, asegúrate de instalar la extensión de
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noreferrer"
                    className="metamask-link font-bold"
                  >
                    MetaMask
                  </a>
                  en tu navegador, así como de habilitar la red de prueba de Goerli. A continuación, inicia sesión con
                  tu cuenta de billetera MetaMask y accede a la pestaña Dashboard de la aplicación para redireccionarte
                  a tu panel de control.
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1 }}>
                  {bull}Si eres productor de café de especialidad y deseas dar seguimiento a tu producto, contáctanos al
                  siguiente{' '}
                  <a
                    target="_blank"
                    href="mailto:coffeetrackec@gmail.com"
                    rel="noreferrer"
                    className="mail-link font-bold"
                  >
                    correo
                  </a>
                  . Nos gustaría ayudarte.
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 lg:col-span-1 max-w-xl mx-auto">
            <Card sx={{ boxShadow: 3 }} className="about-card">
              <CardMedia
                component="img"
                height="194"
                // image="https://cdn.techwireasia.com/wp-content/uploads/2021/01/shutterstock_1079935373-897x500.png"
                image="/static/images/supplychain1.png"
                alt="blockchain technology"
              />
              <CardHeader title="3. Escanea el código QR de tu producto" />

              <CardContent>
                <Typography variant="body2" className="about-info">
                  El producto de venta al público contiene un código QR que al ser escaneado, redirije a la página de
                  nuestra aplicación correspondiente al historial del producto a lo largo de su cadena de suministro.
                </Typography>
                <br />
                <Typography variant="body2" className="about-info" sx={{ marginLeft: 1 }}>
                  {bull}Si eres consumidor de café de especialidad, escanea tu código y empodera a quienes permitieron
                  que el producto llegue a tus manos.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </Grid>
    </div>
  );
};

export default InformativeSection;
