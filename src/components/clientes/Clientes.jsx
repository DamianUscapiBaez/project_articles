import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableContainer, TableHead, TablePagination, TextField, Tooltip } from "@mui/material";
import { StyledTableCell } from '../styles/StyledTableCell';
import { StyledTableRow } from '../styles/StyledTableRow';
import { useEffect, useState } from "react";
import { AddCircleOutline, Close, Delete, Edit, Search } from "@mui/icons-material";
import Config from "../../Config";
import { NewCliente } from "./NewCliente";
import Swal from "sweetalert2";

export const Clientes = () => {
    // constantes
    const [clientes, setClientes] = useState([]);
    const [searchCliente, setSearchCliente] = useState("");
    const [clienteDlg, setClienteDlg] = useState({
        open: false,
        idcliente: ""
    });
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    // handles
    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

    const handleCloseClienteDlg = () => setClienteDlg({ open: false, idcliente: "" });

    const handleOpenClienteDlg = () => setClienteDlg({ open: true, idcliente: "" });
    // functions
    const filterClientes = () => {
        if (searchCliente !== "") {
            const filterClientes = clientes.filter(c => c.nombres.includes(searchCliente.trim().toUpperCase()));
            return filterClientes;
        } else {
            return clientes;
        }
    }
    // apis 
    const listarClientes = async () => {
        const response = await fetch(`${Config.UrlApi}/clientes/listarclientes.php`);
        const data = await response.json();
        setClientes(data);
    }
    const eliminarClienteApi = async (idcliente) => {
        const shouldDelete = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el cliente. ¿Deseas continuar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (shouldDelete.isConfirmed) {
            const response = await fetch(`${Config.UrlApi}/clientes/eliminarcliente.php?idcliente=${idcliente}`);
            const data = await response.json();
            if (data) {
                Swal.fire(
                    'Eliminado',
                    'El cliente ha sido eliminado.',
                    'success'
                );
                listarClientes();
            } else {
                Swal.fire(
                    'Error',
                    'Ocurrió un error al intentar eliminar el cliente.',
                    'error'
                );
            }
        }
    }
    useEffect(() => {
        listarClientes();
    }, []);
    return (
        <Grid container spacing={2} justifyContent={"space-between"}>
            <Dialog open={clienteDlg.open} maxWidth="sm" fullWidth onClose={handleCloseClienteDlg}>
                <DialogTitle>
                    {clienteDlg.idcliente === "" ? "NUEVO" : "EDITAR"} CLIENTE
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseClienteDlg}
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
                    <NewCliente onCloseDlg={handleCloseClienteDlg} listarClientes={listarClientes} idcliente={clienteDlg.idcliente} />
                </DialogContent>
            </Dialog>
            <Grid item xs={12} md={8}>
                <TextField
                    label="BUSCAR POR NOMBRE"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={searchCliente}
                    onChange={(e) => setSearchCliente(e.target.value)}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><Search /></InputAdornment>,
                    }}
                />
            </Grid>
            <Grid item md={2} sx={{ mt: 1 }}>
                <Button color="success" fullWidth variant="contained" startIcon={<AddCircleOutline />} onClick={handleOpenClienteDlg}>
                    NUEVO
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ borderRadius: 2 }}>
                        <TableContainer>
                            <Table sx={{ maxWidth: '275px', minWidth: '100%' }}>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff', width: "5%" }}>#</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>NOMBRES</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff', width: "15%" }}>ACCIONES</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {filterClientes().length === 0 ? (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center" sx={{ fontWeight: 'bold' }}>NO HAY REGISTROS DISPONIBLES</StyledTableCell>
                                        </StyledTableRow>
                                    )
                                        : (rowsPerPage > 0
                                            ? filterClientes().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : filterClientes()
                                        ).map((row) => (
                                            <StyledTableRow
                                                key={row.idcliente}
                                            >
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.idcliente}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.nombres}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>
                                                    <Stack direction={"row"}>
                                                        <Tooltip title="EDITAR CLIENTE" placement="top">
                                                            <IconButton onClick={() => setClienteDlg({ open: true, idcliente: row.idcliente })}>
                                                                <Edit color="warning" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="ELIMINAR CLIENTE" placement="top">
                                                            <IconButton onClick={() => eliminarClienteApi(row.idcliente)}>
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
                            count={filterClientes().length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
}