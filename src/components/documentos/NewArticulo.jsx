import { Close, Save } from "@mui/icons-material";
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";

export const NewArticulo = ({ onCloseDlg, idarticulo, listarArticulos }) => {
    var datenow = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    // constantes
    const [loading, setLoading] = useState(false);
    const [article, setArticle] = useState({
        idarticulo: 0,
        tema: "",
        fecha: datenow,
        concepto: "",
        fuente: "",
        tomo: '',
        resumen: "",
        urlpdf: null
    });
    const [errors, setErrors] = useState({
        tema: '',
        fecha: '',
        concepto: '',
        fuente: "",
        resumen: "",
        urlpdf: ''
    });
    // handles
    const handleForm = (e) => {
        const { name, value, files } = e.target;
        switch (name) {
            case 'tomo':
                if (value !== "") {
                    if (!isNaN(value)) {
                        setArticle({ ...article, [name]: value });
                    }
                } else {
                    setArticle({ ...article, [name]: "" });
                }
                break;
            case 'urlpdf':
                setArticle({ ...article, urlpdf: files[0] });
                setErrors({ ...errors, [name]: "" });
                break;
            default:
                setArticle({ ...article, [name]: value });
                setErrors({ ...errors, [name]: "" });
                break;
        }
    }
    // const apis
    const guardarArticulo = async () => {
        const newErrors = {
            tema: !article.tema ? 'Este campo es obligatorio' : '',
            fecha: !article.fecha ? 'Este campo es obligatorio' : '',
            concepto: !article.concepto ? 'Este campo es obligatorio' : '',
            fuente: !article.fuente ? 'Este campo es obligatorio' : '',
            resumen: !article.resumen ? 'Este campo es obligatorio' : '',
            urlpdf: !article.urlpdf ? 'Este campo es obligatorio' : ''
        };
        setErrors(newErrors);
        setLoading(true);
        if (Object.values(newErrors).every((error) => error === '')) {
            const formData = new FormData();
            formData.append('idarticulo', article.idarticulo);
            formData.append('tema', article.tema.trim().toUpperCase());
            formData.append('fecha', article.fecha);
            formData.append('concepto', article.concepto.trim().toUpperCase());
            formData.append('tomo', article.tomo === "" ? "" : article.tomo);
            formData.append('fuente', article.fuente.trim().toUpperCase());
            formData.append('resumen', article.resumen.trim().toUpperCase());
            formData.append('urlpdf', article.urlpdf);
            if (article.idarticulo > 0) {
                formData.append('urlpdfactual', article.urlpdfactual);
            }
            const response = await fetch(`${Config.UrlApi}/articles/guardararticulo.php`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.guardado && data.guardado !== "existe") {
                Swal.fire(
                    'Guardado!',
                    'Se completó exitosamente.',
                    'success'
                );
                onCloseDlg();
                setArticle({
                    idarticulo: 0,
                    tema: "",
                    fecha: datenow,
                    concepto: "",
                    tomo: '',
                    resumen: "",
                    urlpdf: null
                });
                listarArticulos();
                setLoading(false);
            } else if (data.guardado === "existe") {
                Swal.fire(
                    "Error",
                    "El articulo ingresado ya se encuentra registrado.",
                    "error"
                );
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }
    // use Effect
    useEffect(() => {
        const recuperarArticulo = async (idarticulo) => {
            const response = await fetch(`${Config.UrlApi}/articles/recuperararticulo.php?idarticulo=${idarticulo}`);
            const data = await response.json();
            setArticle({
                idarticulo: data.idarticulo,
                tema: data.tema,
                fecha: data.fecha,
                concepto: data.concepto,
                tomo: data.tomo,
                fuente: data.fuente,
                resumen: data.resumen,
                urlpdf: data.urlpdf,
                urlpdfactual: data.urlpdf
            });
        }
        if (idarticulo !== undefined && idarticulo !== "") recuperarArticulo(idarticulo);
    }, []);
    return (
        <Grid container spacing={2} justifyContent={"center"}>
            <Grid item xs={12}>
                <TextField
                    label="TEMA"
                    fullWidth
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    margin="dense"
                    size="small"
                    name="tema"
                    value={article.tema}
                    onChange={handleForm}
                    error={!!errors.tema}
                    helperText={errors.tema}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TextField
                    label="FECHA"
                    fullWidth
                    margin="dense"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name="fecha"
                    value={article.fecha}
                    onChange={handleForm}
                    error={!!errors.fecha}
                    helperText={errors.fecha}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="dense" error={!!errors.concepto}>
                    <InputLabel>CONCEPTO</InputLabel>
                    <Select
                        size="small"
                        label="CONCEPTO"
                        name="concepto"
                        value={article.concepto}
                        onChange={handleForm}
                    >
                        <MenuItem value="R">RESOLUCION TRIBUNAL FISCAL</MenuItem>
                        <MenuItem value="N">NOTA DE PERIODICO</MenuItem>
                        <MenuItem value="L">LIBRO</MenuItem>
                    </Select>
                    <FormHelperText>{errors.concepto}</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField
                    label="TOMO"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name="tomo"
                    value={article.tomo !== null ? article.tomo : ''}
                    onChange={handleForm}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="FUENTE"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name="fuente"
                    value={article.fuente !== null ? article.fuente : ''}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    onChange={handleForm}
                    error={!!errors.fuente}
                    helperText={errors.fuente}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    fullWidth
                    margin="dense"
                    label="archivo"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    type="file"
                    name="urlpdf"
                    inputProps={{ accept: "application/pdf" }} // 100 MB in bytes
                    onChange={handleForm}
                    error={!!errors.urlpdf}
                    helperText={errors.urlpdf}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="RESUMEN"
                    fullWidth
                    margin="dense"
                    size="small"
                    multiline
                    rows={5}
                    name="resumen"
                    value={article.resumen !== null ? article.resumen : ''}
                    onChange={handleForm}
                    error={!!errors.resumen}
                    helperText={errors.resumen}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                />
            </Grid>
            <Grid item xs={6} md={3}>
                <LoadingButton loading={loading} fullWidth variant="contained" color="success" startIcon={<Save />} onClick={guardarArticulo}>GUARDAR</LoadingButton>
            </Grid>
            <Grid item xs={6} md={3}>
                <Button fullWidth variant="contained" color="error" startIcon={<Close />} onClick={onCloseDlg}>CANCELAR</Button>
            </Grid>
        </Grid>
    );
}