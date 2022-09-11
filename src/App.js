import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import styled from '@emotion/styled'
import { Table, TableContainer, TableHead, TableCell, TableBody, Modal, Box, Typography, TableRow, Button, TextField } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const baseUrl = "http://localhost:3030/contactos";
const crearUrl = "http://localhost:3030/crear-contactos";
const ActualizarUrl = "http://localhost:3030/actualizar-contactos/";
const EliminarUrl = "http://localhost:3030/eliminar-contacto/";

// const Modal = styled.modal`
//   position: absolute;
//   width: 400px;
//   border: '2px solid #000';
//   padding: theme.spacing(2, 4, 3);
//   top: '50%';
//   left: '50%';
//   transform: 'translate(-50%, -50%)';
// `;

// const useStyles = makeStyles((theme) => ({
//   modal: {
//     position: 'absolute',
//     width: 400,
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)'
//   },
//   iconos: {
//     cursor: 'pointer'
//   },
//   inputMaterial: {
//     width: '100%'
//   }
// }));


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const inputMaterial = {
  width: '100%'
}

const iconos = {
  cursor: 'pointer'
}

function App() {
  const [data, setData] = useState({ mensaje: "", contactos: [] });
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [consolaSeleccionada, setConsolaSeleccionada] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: '',
    origen: '',
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setConsolaSeleccionada(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(consolaSeleccionada);
  }

  const peticionGet = async () => {
    await axios.get(baseUrl).then(response => {
      setData(response.data)
      console.log(response.data)
    })
  }

  const peticionPost = async () => {
    await axios.post(crearUrl, consolaSeleccionada)
      .then(response => {
        setData(data.concat(response.data))
        console.log(response.data);
        abrirCerrarModalInsertar()
      })
  }

  const peticionPut = async () => {
    await axios.post(ActualizarUrl + consolaSeleccionada.id, consolaSeleccionada)
      .then(response => {
        var dataNueva = data;
        dataNueva.map(consola => {
          if (consolaSeleccionada.id === consola.id) {
            consola.nombre = consolaSeleccionada.nombre;
            consola.apellido = consolaSeleccionada.apellido;
            consola.email = consolaSeleccionada.email;
            consola.telefono = consolaSeleccionada.telefono;
            consola.direccion = consolaSeleccionada.direccion;
            consola.tipo = consolaSeleccionada.tipo;
            consola.origen = consolaSeleccionada.origen;
          }
        })
        setData(dataNueva);
        abrirCerrarModalEditar();
      })
  }

  const peticionDelete=async()=>{
    await axios.delete(EliminarUrl+consolaSeleccionada.id)
    .then(response=>{
      setData(data.filter(consola=>consola.id!==consolaSeleccionada.id));
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarConsola = (consola, caso) => {
    setConsolaSeleccionada(consola);
    (caso === 'Editar')?setModalEditar(true):abrirCerrarModalEliminar()
  }

  useEffect(() => {
    peticionGet();
  }, [])

  const bodyInsertar = (
    <Box sx={style}>
      <h3>Agregar Contacto</h3>
      <TextField name="nombre" sx={inputMaterial} label="Nombre" onChange={handleChange} />
      <br />
      <TextField name="apellido" sx={inputMaterial} label="Apellido" onChange={handleChange} />
      <br />
      <TextField name="email" sx={inputMaterial} label="Email" onChange={handleChange} />
      <br />
      <TextField name="telefono" sx={inputMaterial} label="Telefono" onChange={handleChange} />
      <br />
      <TextField name="direccion" sx={inputMaterial} label="Direccion" onChange={handleChange} />
      <br />
      <TextField name="tipo" sx={inputMaterial} label="Tipo Cliente" onChange={handleChange} />
      <br />
      <TextField name="origen" sx={inputMaterial} label="Origen" onChange={handleChange} />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPost()}>Insertar</Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </Box>
  )

  const bodyEditar = (
    <Box sx={style}>
      <h3>Editar Contacto</h3>
      <TextField name="nombre" sx={inputMaterial} label="Nombre" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.nombre} />
      <br />
      <TextField name="apellido" sx={inputMaterial} label="Apellido" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.apellido} />
      <br />
      <TextField name="email" sx={inputMaterial} label="Email" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.email} />
      <br />
      <TextField name="telefono" sx={inputMaterial} label="Telefono" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.telefono} />
      <br />
      <TextField name="direccion" sx={inputMaterial} label="Direccion" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.direccion} />
      <br />
      <TextField name="tipo" sx={inputMaterial} label="Tipo Cliente" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.tipo} />
      <br />
      <TextField name="origen" sx={inputMaterial} label="Origen" onChange={handleChange} value={consolaSeleccionada && consolaSeleccionada.origen} />
      <br />
      <div align="right">
        <Button color="primary" onClick={() => peticionPut()}>Editar</Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </Box>
  )

  const bodyEliminar=(
    <Box sx={style}>
      <p>Estás seguro que deseas eliminar la consola <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>
      </div>
    </Box>
  )
  return (
    <div className="App">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Tipo Cliente</TableCell>
              <TableCell>Origen</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.contactos.map(consola => (
              <TableRow key={consola.id}>
                <TableCell>{consola.nombre}</TableCell>
                <TableCell>{consola.apellido}</TableCell>
                <TableCell>{consola.email}</TableCell>
                <TableCell>{consola.telefono}</TableCell>
                <TableCell>{consola.direccion}</TableCell>
                <TableCell>{consola.tipo}</TableCell>
                <TableCell>{consola.origen}</TableCell>
                <TableCell>
                  <Edit sx={iconos} onClick={() => seleccionarConsola(consola, 'Editar')} />
                  &nbsp;&nbsp;&nbsp;
                  <Delete sx={iconos} onClick={() => seleccionarConsola(consola, 'Eliminar')} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button onClick={() => abrirCerrarModalInsertar()}>Agregar</Button>
      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}
      >
        {bodyInsertar}
      </Modal>

      <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>
    </div >
  );
}

export default App;
