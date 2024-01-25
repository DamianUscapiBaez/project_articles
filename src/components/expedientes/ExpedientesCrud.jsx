import { AddCircleOutline, Assignment, Close, Delete, Edit, People, Search } from "@mui/icons-material";
import { Autocomplete, Box, Button, Card, CardContent, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, Table, TableBody, TableContainer, TableHead, TablePagination, TextField, Tooltip, Typography } from "@mui/material";
import { StyledTableCell } from '../styles/StyledTableCell';
import { StyledTableRow } from '../styles/StyledTableRow';
import { useEffect, useState } from "react";
import pdf from "../../assets/pdf.png";
import Config from "../../Config";
import { NewExpediente } from "./NewExpediente";
import { Clientes } from "../clientes/Clientes";
import Swal from "sweetalert2";

export const ExpedientesCrud = () => {
    // const 
    const [expedientes, setExpedientes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    const [clientesDlg, setClienteDlg] = useState(false);
    const [expedienteDlg, setExpedienteDlg] = useState({
        open: false,
        idexpediente: ""
    });
    const [searchExpediente, setSearchExpediente] = useState({
        busqueda: "",
        idcliente: 0
    });
    const [viewpdf, setViewPdf] = useState({
        open: false,
        datarticle: ""
    });
    // handles
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseViewPdf = () => setViewPdf({ open: false, datarticle: "" });

    const handleOpenExpedienteDlg = () => setExpedienteDlg({ open: true, idexpediente: '' });

    const handleCloseExpedienteDlg = () => setExpedienteDlg({ open: false, idexpediente: '' });

    const handleBuscarExpediente = (e) => {
        const { value } = e.target;
        setSearchExpediente({ ...searchExpediente, busqueda: value });
    }
    const handleAutocompleteCliente = (e, values) => {
        const idcliente = values !== null ? values.idcliente : 0;
        setSearchExpediente({ ...searchExpediente, idcliente });
    };
    // apis
    const buscarExpediente = async () => {
        const { busqueda, idcliente } = searchExpediente;
        const response = await fetch(`${Config.UrlApi}/expedientes/buscarexpediente.php?busqueda=${busqueda}&idcliente=${idcliente}`);
        const data = await response.json();
        setExpedientes(data);
    }
    const listarExpedientes = async () => {
        const response = await fetch(`${Config.UrlApi}/expedientes/listarexpedientes.php`);
        const data = await response.json();
        setExpedientes(data);
    }
    const recuperarPdf = async (idexpediente) => {
        const response = await fetch(`${Config.UrlApi}/expedientes/recuperarexpediente.php?idexpediente=${idexpediente}`);
        const data = await response.json();
        if (data) {
            setViewPdf({ open: true, datarticle: data });
        }
    }
    const eliminarExpedienteApi = async (idexpediente, pdfname) => {
        const shouldDelete = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el expediente. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (shouldDelete.isConfirmed) {
            const response = await fetch(`${Config.UrlApi}/expedientes/eliminarexpediente.php?idexpediente=${idexpediente}&pdfname=${pdfname}`);
            const data = await response.json();
            if (data) {
                Swal.fire(
                    'Eliminado',
                    'El documento ha sido eliminado.',
                    'success'
                );
                listarExpedientes();
            } else {
                Swal.fire(
                    'Error',
                    'Ocurrió un error al intentar eliminar el expediente.',
                    'error'
                );
            }
        }
    }
    useEffect(() => {
        const listarClientes = async () => {
            const response = await fetch(`${Config.UrlApi}/clientes/listarclientes.php`);
            const data = await response.json();
            setClientes(data);
        }
        listarClientes();
        listarExpedientes();
    }, []);
    return (
        <Container maxWidth="xl">
            <Dialog open={viewpdf.open} maxWidth="md" fullWidth onClose={handleCloseViewPdf}>
                <DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseViewPdf}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ p: 1, justifyContent: 'center', mt: 3 }}>
                        <Grid item xs={12}>
                            <Card sx={{ marginBottom: 1 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom textAlign={'center'}>
                                        {viewpdf.datarticle.tema} - {viewpdf.datarticle.nroexpediente}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={'center'}>
                                        <Box component="span" fontWeight="bold">
                                            Fecha:
                                        </Box>{" "}
                                        {viewpdf.datarticle.fecha !== undefined ? viewpdf.datarticle.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1') : ""} &nbsp;
                                        <Box component="span" fontWeight="bold">
                                            Cliente:
                                        </Box>{" "}
                                        {viewpdf.datarticle.cliente} &nbsp;
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                viewpdf.datarticle !== "" &&
                                <Box display="flex" justifyContent="center">
                                    <iframe
                                        src={`${Config.UrlExpedientes}/${viewpdf.datarticle.urlpdf}`}
                                        width="100%"
                                        height="600px"
                                        title="PDF Viewer"
                                        style={{ border: "none" }}
                                    />
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={expedienteDlg.open} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {expedienteDlg.idexpediente === "" ? "NUEVO" : "EDITAR"} EXPEDIENTE
                </DialogTitle>
                <DialogContent>
                    <NewExpediente onCloseDlg={handleCloseExpedienteDlg} listarExpedientes={listarExpedientes} idexpediente={expedienteDlg.idexpediente} />
                </DialogContent>
            </Dialog>
            <Dialog open={clientesDlg} maxWidth="md" fullWidth onClose={() => setClienteDlg(false)}>
                <DialogTitle>
                    CLIENTES
                    <IconButton
                        aria-label="close"
                        onClick={() => setClienteDlg(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Clientes />
                </DialogContent>
            </Dialog>
            <Grid container spacing={3} justifyContent={"center"} sx={{ mt: 2 }}>
                <Grid item xs={12} md={12}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Assignment sx={{ fontSize: 40, color: '#2962ff' }} />
                            <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: '#2962ff' }}>
                                EXPEDIENTES
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
                            Crea, edita y elimina expedientes eficientemente. Adjunta y visualiza documentos PDF para una gestión completa. Simplifica tus procesos documentales y mejora la accesibilidad a los datos esenciales. Experimenta una gestión de expedientes intuitiva y organizada.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item md={3} xs={12}>
                    <TextField
                        label="BUSCAR"
                        size="small"
                        fullWidth
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        name="busqueda"
                        value={searchExpediente.busqueda}
                        onChange={handleBuscarExpediente}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <Autocomplete
                        options={clientes}
                        getOptionLabel={(option) => option.nombres}
                        value={clientes.find((c) => c.idcliente === searchExpediente.idcliente) || null}
                        onChange={handleAutocompleteCliente}
                        renderInput={(params) => <TextField {...params} label="CLIENTE" size="small" />}
                    />
                </Grid>
                <Grid item md={2} xs={6}>
                    <Button fullWidth startIcon={<Search />} variant="contained" color="primary"
                        onClick={buscarExpediente}
                    >
                        Buscar
                    </Button>
                </Grid>
                <Grid item md={2} xs={6}>
                    <Button
                        fullWidth
                        color="secondary"
                        variant="contained"
                        startIcon={<People />}
                        onClick={() => setClienteDlg(true)}>
                        CLIENTES
                    </Button>
                </Grid>
                <Grid item md={2} xs={6}>
                    <Button
                        fullWidth
                        color="success"
                        variant="contained"
                        startIcon={<AddCircleOutline />}
                        onClick={handleOpenExpedienteDlg}>
                        NUEVO
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={2}>
                        <TableContainer>
                            <Table sx={{ maxWidth: '275px', minWidth: '100%' }}>
                                <TableHead sx={{ bgcolor: '#0077B6' }}>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff', width: '5%' }} align="right">#</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>FECHA</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>NRO EXPEDIENTE</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>CLIENTE</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>TEMA</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff', width: '15%' }}>ACCIONES</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {expedientes.length === 0 ? (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center">NO HAY REGISTROS DISPONIBLES</StyledTableCell>
                                        </StyledTableRow>
                                    )
                                        : (rowsPerPage > 0
                                            ? expedientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : expedientes
                                        ).map((row) => (
                                            <StyledTableRow
                                                key={row.idexpediente}
                                            >
                                                <StyledTableCell sx={{ fontSize: '12px' }} align="right">{row.idexpediente}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.nroexpediente}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.cliente}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.tema}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>
                                                    <Stack direction={"row"}>
                                                        <Tooltip title="VER PDF" placement="top">
                                                            <IconButton
                                                                onClick={() => recuperarPdf(row.idexpediente)}
                                                            >
                                                                <img src={pdf} height={25} width={25} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="EDITAR PDF" placement="top">
                                                            <IconButton
                                                                onClick={() => setExpedienteDlg({ open: true, idexpediente: row.idexpediente })}
                                                            >
                                                                <Edit color="warning" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="ELIMINAR DOCUMENTO" placement="top">
                                                            <IconButton
                                                                onClick={() => eliminarExpedienteApi(row.idexpediente, row.urlpdf)}
                                                            >
                                                                <Delete color="error" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            sx={{ background: "#005187", color: "#fff" }}
                            component="div"
                            rowsPerPageOptions={[15, 25, 50]}
                            count={expedientes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}