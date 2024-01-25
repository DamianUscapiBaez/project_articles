import { Box, Button, Card, CardContent, Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableContainer, TableHead, TablePagination, TextField, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Config from '../../Config';
import pdf from "../../assets/pdf.png";
import { Close, Search } from "@mui/icons-material";
import { StyledTableCell } from '../styles/StyledTableCell';
import { StyledTableRow } from '../styles/StyledTableRow';

export const Articles = () => {
    // const
    const [articulos, setArticulos] = useState([]);
    // const table
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(0);
    const [buscarArticulo, setBuscarArticulo] = useState({
        resumen: '',
        tomo: '',
        fuente: '',
        categoria: 'A'
    });
    const [viewpdf, setViewPdf] = useState({
        open: false,
        datarticle: ""
    });
    const conceptoMap = {
        "R": "RESOLUCION TRIBUNAL FISCAL",
        "N": "NOTA DE PERIODICO",
        "L": "LIBRO"
    };
    
    // handles
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseViewPdf = () => setViewPdf({ open: false, datarticle: "" });

    const handleBuscarArticulo = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'tomo':
                if (!isNaN(value)) {
                    setBuscarArticulo({ ...buscarArticulo, [name]: value });

                }
                break;
            default:
                setBuscarArticulo({ ...buscarArticulo, [name]: value });
                break;
        }
    }
    // apis
    const buscarArticuloAPi = async () => {
        const { resumen, tomo, categoria, fuente } = buscarArticulo;
        const buscar = await fetch(`${Config.UrlApi}/articles/buscararticulos.php?resumen=${resumen}&tomo=${tomo}&categoria=${categoria}&fuente=${fuente}`);
        const response = await buscar.json();
        setArticulos(response);
    }
    const recuperarPdf = async (idarticulo) => {
        const response = await fetch(`${Config.UrlApi}/articles/recuperararticulo.php?idarticulo=${idarticulo}`);
        const data = await response.json();
        if (data) {
            setViewPdf({ open: true, datarticle: data });
        }
    }

    useEffect(() => {
        const listarArticulos = async () => {
            const response = await fetch(`${Config.UrlApi}/articles/listararticulos.php`);
            const data = await response.json();
            setArticulos(data);
        }
        listarArticulos();
    }, []);

    return (
        <Container maxWidth="xl">
            <Dialog open={viewpdf.open} maxWidth="sm" fullWidth onClose={handleCloseViewPdf}>
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
                    <Grid container spacing={2} sx={{ p: 1, justifyContent: 'center' }}>
                        <Grid item xs={12}>
                            <Card sx={{ marginBottom: 1 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom textAlign={'center'}>
                                        {viewpdf.datarticle.tema}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" textAlign={'center'}>
                                        <Box component="span" fontWeight="bold">
                                            Fecha:
                                        </Box>{" "}
                                        {viewpdf.datarticle.fecha !== undefined ? viewpdf.datarticle.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1') : ""} &nbsp;
                                        <Box component="span" fontWeight="bold">
                                            Tomo:
                                        </Box>{" "}
                                        {viewpdf.datarticle.tomo} &nbsp;
                                        <Box component="span" fontWeight="bold">
                                            Fuente:
                                        </Box>{" "}
                                        {viewpdf.datarticle.fuente} &nbsp;
                                        <Box component="span" fontWeight="bold">
                                            Concepto:
                                        </Box>{" "}
                                        {conceptoMap[viewpdf.datarticle.concepto]}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} textAlign={'center'}>
                                        <Box component="span" fontWeight="bold">
                                            Resumen
                                        </Box>{" "}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {viewpdf.datarticle.resumen}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                viewpdf.datarticle !== "" &&
                                <Box display="flex" justifyContent="center">
                                    <iframe
                                        src={`${Config.UrlDocuments}/${viewpdf.datarticle.urlpdf}`}
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
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12}>
                    <Typography variant="h4">DOCUMENTOS</Typography>
                </Grid>
                <Grid item md={4} xs={12}>
                    <TextField
                        label="BUSCAR POR RESUMEN"
                        size="small"
                        fullWidth
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        name="resumen"
                        value={buscarArticulo.resumen}
                        onChange={handleBuscarArticulo}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <TextField
                        label="FUENTE"
                        size="small"
                        fullWidth
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        name="fuente"
                        value={buscarArticulo.fuente}
                        onChange={handleBuscarArticulo}
                    />
                </Grid>
                <Grid item md={1} xs={12}>
                    <TextField
                        label="TOMO"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: 'uppercase' } }}
                        name="tomo"
                        value={buscarArticulo.tomo}
                        onChange={handleBuscarArticulo}
                    />
                </Grid>
                <Grid item md={3} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>CATEGORIA</InputLabel>
                        <Select
                            size="small"
                            label="CATEGORIA"
                            name="categoria"
                            value={buscarArticulo.categoria}
                            onChange={handleBuscarArticulo}
                        >
                            <MenuItem value="A">TODO</MenuItem>
                            <MenuItem value="R">RESOLUCION TRIBUNAL FISCAL</MenuItem>
                            <MenuItem value="N">NOTA DE PERIODICO</MenuItem>
                            <MenuItem value="L">LIBRO</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={1} xs={6}>
                    <Button fullWidth startIcon={<Search />} variant="contained" color="primary" onClick={buscarArticuloAPi}>
                        Buscar
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={2} sx={{ borderRadius: 2 }}>
                        <TableContainer>
                            <Table sx={{ maxWidth: '275px', minWidth: '100%' }}>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>FECHA</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>TEMA</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>CONCEPTO</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>FUENTE</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>RESUMEN</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }} align="right">TOMO</StyledTableCell>
                                        <StyledTableCell sx={{ fontWeight: 'bold', color: '#fff' }}>VER</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {articulos.length === 0 ? (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={9} align="center" sx={{ fontWeight: 'bold' }}>NO HAY REGISTROS DISPONIBLES</StyledTableCell>
                                        </StyledTableRow>
                                    )
                                        : (rowsPerPage > 0
                                            ? articulos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : articulos
                                        ).map((row) => (
                                            <StyledTableRow
                                                key={row.idarticulo}
                                            >
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.fecha.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1')}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{row.tema}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{conceptoMap[row.concepto]}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>{!!row.fuente ? row.fuente : "SIN FUENTE"}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>
                                                    {row.resumen !== null && row.resumen.length > 50 ? `${row.resumen.substring(0, 50)}...` : row.resumen}
                                                </StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }} align="right">{row.tomo}</StyledTableCell>
                                                <StyledTableCell sx={{ fontSize: '12px' }}>
                                                    <Tooltip title="VER PDF" placement="top">
                                                        <IconButton onClick={() => recuperarPdf(row.idarticulo)}>
                                                            <img src={pdf} height={25} width={25} />
                                                        </IconButton>
                                                    </Tooltip>
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
                            count={articulos.length}
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