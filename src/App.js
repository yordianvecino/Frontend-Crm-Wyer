import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import styled from '@emotion/styled'
import { Table, Container, TableContainer, OutlinedInput, InputAdornment, TableHead, TableCell, TableBody, Modal, Box, Typography, TableRow, Button, TextField } from '@mui/material';
import { Edit, Delete, AddTask, PersonAdd } from '@mui/icons-material';
import { borderRadius } from '@mui/system';

const baseUrl = "http://localhost:3030/contactos";
const crearUrl = "http://localhost:3030/crear-contactos";
const ActualizarUrl = "http://localhost:3030/actualizar-contactos/";
const EliminarUrl = "http://localhost:3030/eliminar-contacto/";

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
  backgroundColor: '#eeeeee'
};

const inputMaterial = {
  width: '100%',
  margin: 1,
  backgroundColor: '#fff'
}

const modal = {
  backgroundColor: '#eeeeee'
}

const inputBuscar = {
  width: '100%',
  margin: 1,
  backgroundColor: '#eeeeee'
}

const iconos = {
  cursor: 'pointer'
}

const tableRow = {
  backgroundColor: '#eeeeee',
  borderRadius: 30
}

function App() {
  const [data, setData] = useState({ mensaje: "", data: [] });
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

  const [buscar, setBuscar] =useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setConsolaSeleccionada(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleChangeBuscar = e => {
    setBuscar(e.target.value)
    filtrar(e.target.value)
  }

  const filtrar=(terminoBusqueda)=>{
    var resultadosBusqueda=data.data.filter((elemento)=>{
      if(elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      || elemento.telefono.nombre.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
      ){
        return elemento;
      }
    });
    setData(resultadosBusqueda);
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
        console.log(response.data);
        abrirCerrarModalInsertar()
      }).catch(error => {
        console.log(error)
      })
    setData(data);
  }

  const peticionPut = async () => {
    await axios.put(ActualizarUrl + consolaSeleccionada.id, consolaSeleccionada)
      .then(response => {
        var dataNueva = data;
        dataNueva.data.map(consola => {
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

  const peticionDelete = async () => {
    await axios.delete(EliminarUrl + consolaSeleccionada.id)
      .then(response => {
        console.log(response.data)
        abrirCerrarModalEliminar();
      })
    setData(data);
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
    (caso === 'Editar') ? setModalEditar(true) : abrirCerrarModalEliminar()
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

  const bodyEliminar = (
    <Box sx={style}>
      <p>Estás seguro que deseas eliminar la consola <b>{consolaSeleccionada && consolaSeleccionada.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={() => peticionDelete()} >Sí</Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </Box>
  )
  return (
    <Container className="App" maxWidth="sm">
      <div>
        <TextField
          variant="outlined"
          label="Buscar"
          id="outlined-start-adornment"
          sx={inputBuscar}
          onChange={handleChangeBuscar}
          endAdornment={<InputAdornment position="end">
            <Edit
              aria-label="toggle password visibility"
              edge="end"
            >
            </Edit>
          </InputAdornment>}
        />
      </div>
      <h3>Listar Contactos</h3>
      <TableContainer>
        <Table>
          <TableBody>
            {data.data.map(consola => (
              <TableRow sx={tableRow} key={consola.id}>
                <TableCell>
                  <b>{consola.nombre}</b>
                  <br />
                  {consola.telefono}
                </TableCell>
                <TableCell>
                  <Edit color="primary" sx={iconos} onClick={() => seleccionarConsola(consola, 'Editar')} />
                  &nbsp;&nbsp;&nbsp;
                  <AddTask color="primary" sx={iconos} />
                  &nbsp;&nbsp;&nbsp;
                  <Delete color="error" sx={iconos} onClick={() => seleccionarConsola(consola, 'Eliminar')} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <br />
      <Button variant="contained" onClick={() => abrirCerrarModalInsertar()}>Agregar &nbsp;<PersonAdd /></Button>
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
    </Container>
  );
}

export default App;
