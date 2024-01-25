import { Box, Card, CardContent, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import { Article, Assignment, Close } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Config from "../src/Config";
import pdf from "../src/assets/pdf.png";

export const Home = () => {
    const [expediente, setExpediente] = useState(0);
    const [documento, setDocumento] = useState(0);
    const [ultimosExpedientes, setUltimosExpedientes] = useState([]);
    const [ultimosDocumentos, setUltimosDocumentos] = useState([]);

    const [viewpdf, setViewPdf] = useState({
        open: false,
        datarticle: "",
        tipo: ""
    });
    const handleCloseViewPdf = () => setViewPdf({ open: false, datarticle: "" });

    const recuperarPdfDocumento = async (idarticulo) => {
        const response = await fetch(`${Config.UrlApi}/articles/recuperararticulo.php?idarticulo=${idarticulo}`);
        const data = await response.json();
        if (data) {
            setViewPdf({ open: true, datarticle: data, tipo: "D" });
        }
    }

    const recuperarPdfExpediente = async (idexpediente) => {
        const response = await fetch(`${Config.UrlApi}/expedientes/recuperarexpediente.php?idexpediente=${idexpediente}`);
        const data = await response.json();
        if (data) {
            setViewPdf({ open: true, datarticle: data, tipo: "E" });
        }
    }
    useEffect(() => {
        const listarnros = async () => {
            const nroexpediente = await fetch(`${Config.UrlApi}/expedientes/obtenernroexpedientes.php`);
            const datanroexpediente = await nroexpediente.json();
            setExpediente(datanroexpediente);

            const nrodocumento = await fetch(`${Config.UrlApi}/articles/obtenernrodocumentos.php`);
            const datanrodocumento = await nrodocumento.json();
            setDocumento(datanrodocumento);

            const ultimosexpedientes = await fetch(`${Config.UrlApi}/expedientes/ultimosexpedientes.php`);
            const dataultimosexpedientes = await ultimosexpedientes.json();
            setUltimosExpedientes(dataultimosexpedientes);

            const ultimosarticulos = await fetch(`${Config.UrlApi}/articles/ultimosarticulos.php`);
            const dataultimosarticulos = await ultimosarticulos.json();
            setUltimosDocumentos(dataultimosarticulos);

        }
        listarnros();
    }, []);
    return (
        <Container maxWidth="xl">
            <Grid container justifyContent="center" spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} md={12}>
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <HomeIcon style={{ fontSize: 40, color: '#2962ff' }} />
                            <Typography variant="h4" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: '#2962ff' }}>
                                INICIO
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
                            Bienvenido al panel principal del sistema, donde puedes acceder fácilmente a los distintos módulos del sistema.
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item md={3}></Grid>
                <Grid item md={3}>
                    <Card style={{ borderRadius: 10, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 5, backgroundColor: "#d50000", borderRadius: '10px 0 0 10px' }}></div>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <IconButton style={{ backgroundColor: "#d50000", color: '#fff' }}>
                                <Article sx={{ fontSize: 30 }} />
                            </IconButton>
                            <Typography variant="h6" component="div" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: '#555', marginTop: 5 }}>
                                DOCUMENTOS
                            </Typography>
                            <Typography style={{ fontFamily: 'cursive', color: '#555', fontSize: '20px' }}>
                                {documento}
                            </Typography>
                            <Link
                                style={{
                                    fontFamily: 'cursive',
                                    color: '#555',
                                    fontSize: '18px',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s'
                                }}
                                to="/documentos"
                                onMouseOver={(e) => (e.target.style.color = '#d50000')}
                                onMouseOut={(e) => (e.target.style.color = '#555')}
                            >
                                Ir a documentos
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={3}>
                    <Card style={{ borderRadius: 10, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 5, backgroundColor: '#2962ff', borderRadius: '10px 0 0 10px' }}></div>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <IconButton style={{ backgroundColor: '#2962ff', color: '#fff' }}>
                                <Assignment sx={{ fontSize: 30 }} />
                            </IconButton>
                            <Typography variant="h6" component="div" style={{ fontFamily: 'cursive', fontWeight: 'bold', color: '#555', marginTop: 5 }}>
                                EXPEDIENTES
                            </Typography>
                            <Typography style={{ fontFamily: 'cursive', color: '#555', fontSize: '20px' }}>
                                {expediente}
                            </Typography>
                            <Link
                                style={{
                                    fontFamily: 'cursive',
                                    color: '#555',
                                    fontSize: '18px',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s'
                                }}
                                to="/expedientes"
                                onMouseOver={(e) => (e.target.style.color = '#2962ff')}
                                onMouseOut={(e) => (e.target.style.color = '#555')}
                            >
                                Ir a expedientes
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item md={3}></Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: 10 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2, color: '#d50000', textAlign: "center" }}>
                            Últimos Expedientes
                        </Typography>
                        <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: 8 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>FECHA</TableCell>
                                        <TableCell>NRO. EXPEDIENTE</TableCell>
                                        <TableCell>TEMA</TableCell>
                                        <TableCell>CLIENTE</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ultimosExpedientes.map((expediente, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{expediente.idexpediente}</TableCell>
                                            <TableCell>{expediente.fecha}</TableCell>
                                            <TableCell>{expediente.nroexpediente}</TableCell>
                                            <TableCell>{expediente.tema}</TableCell>
                                            <TableCell>{expediente.cliente}</TableCell>
                                            <TableCell>
                                                <Tooltip title="VER PDF" placement="top">
                                                    <IconButton
                                                        onClick={() => recuperarPdfExpediente(expediente.idexpediente)}
                                                    >
                                                        <img src={pdf} height={25} width={25} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ padding: 2, borderRadius: 10 }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2, color: '#2962ff', textAlign: "center" }}>
                            Últimos Documentos
                        </Typography>
                        <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: 8 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>FECHA</TableCell>
                                        <TableCell>TEMO</TableCell>
                                        <TableCell>TOMO</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ultimosDocumentos.map((documento, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{documento.idarticulo}</TableCell>
                                            <TableCell>{documento.fecha}</TableCell>
                                            <TableCell>{documento.tema}</TableCell>
                                            <TableCell>{documento.tomo}</TableCell>
                                            <TableCell>
                                                <Tooltip title="VER PDF" placement="top">
                                                    <IconButton
                                                        onClick={() => recuperarPdfDocumento(documento.idarticulo)}
                                                    >
                                                        <img src={pdf} height={25} width={25} />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
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
                                        src={`${viewpdf.tipo == "E" ? Config.UrlExpedientes : Config.UrlDocuments}/${viewpdf.datarticle.urlpdf}`}
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
        </Container>
    )
}
