import { Close, FormatListNumbered, Save } from "@mui/icons-material";
import { Autocomplete, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Config from "../../Config";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";

export const NewExpediente = ({ onCloseDlg, idexpediente, listarExpedientes }) => {
    var datenow = new Date().toLocaleDateString('en-GB', { timeZone: 'America/Lima' }).split('/').reverse().join('-');
    // constantes
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expediente, setExpediente] = useState({
        idexpediente: 0,
        nroexpediente: "",
        fecha: datenow,
        idcliente: 0,
        tema: '',
        urlpdf: ''
    });
    const [errors, setErrors] = useState({
        nroexpediente: '',
        fecha: '',
        idcliente: '',
        tema: '',
        urlpdf: ''
    });
    // handles
    const handleForms = (e) => {
        const { name, value, files } = e.target;

        let updatedExpediente = { ...expediente };
        updatedExpediente[name] = name === 'urlpdf' ? files[0] : value;

        setExpediente(updatedExpediente);
        setErrors({ ...errors, [name]: "" });
    };

    const handleAutocompleteCliente = (e, values) => {
        const idcliente = values !== null ? values.idcliente : 0;
        setExpediente({ ...expediente, idcliente });
        setErrors({ ...errors, idcliente: "" });
    };
    // const apis
    const guardarExpediente = async () => {
        const newErrors = {
            nroexpediente: !expediente.nroexpediente ? 'Este campo es obligatorio' : '',
            fecha: !expediente.fecha ? 'Este campo es obligatorio' : '',
            idcliente: !expediente.idcliente ? 'Este campo es obligatorio' : '',
            tema: !expediente.tema ? 'Este campo es obligatorio' : '',
            urlpdf: !expediente.urlpdf ? 'Este campo es obligatorio' : ''
        };
        setErrors(newErrors);
        setLoading(true);
        if (Object.values(newErrors).every((error) => error === '')) {
            const formData = new FormData();

            formData.append('idexpediente', expediente.idexpediente);
            formData.append('nroexpediente', expediente.nroexpediente.trim().toUpperCase());
            formData.append('fecha', expediente.fecha);
            formData.append('idcliente', expediente.idcliente);
            formData.append('tema', expediente.tema.trim().toUpperCase());
            formData.append('urlpdf', expediente.urlpdf);
            if (expediente.idexpediente > 0) {
                formData.append('urlpdfactual', expediente.urlpdfactual);
            }
            const response = await fetch(`${Config.UrlApi}/expedientes/guardarexpediente.php`, {
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
                setExpediente({
                    idexpediente: 0,
                    nroexpediente: "",
                    fecha: datenow,
                    idcliente: 0,
                    tema: "",
                    urlpdf: ""
                });
                listarExpedientes();
                setLoading(false);
            } else if (data.guardado === "existe") {
                setLoading(false);
                Swal.fire(
                    "Error",
                    "El expediente ingresado ya se encuentra registrado.",
                    "error"
                );
            }
        }else{
            setLoading(false);
        }
    }
    // use Effect
    useEffect(() => {
        const listarClientes = async () => {
            const response = await fetch(`${Config.UrlApi}/clientes/listarclientes.php`);
            const data = await response.json();
            setClientes(data);
        }
        const recuperarExpediente = async (idexpediente) => {
            const response = await fetch(`${Config.UrlApi}/expedientes/recuperarexpediente.php?idexpediente=${idexpediente}`);
            const data = await response.json();
            setExpediente({
                idexpediente: data.idexpediente,
                nroexpediente: data.nroexpediente,
                fecha: data.fecha,
                idcliente: data.idcliente,
                tema: data.tema,
                urlpdf: data.urlpdf,
                urlpdfactual: data.urlpdf
            });
        }
        if (idexpediente !== undefined && idexpediente !== "") recuperarExpediente(idexpediente);
        listarClientes();
    }, []);
    return (
        <Grid container spacing={2} justifyContent={"center"}>
            <Grid item xs={12} md={7}>
                <TextField
                    label="NRO EXPEDIENTE"
                    fullWidth
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    margin="dense"
                    size="small"
                    name="nroexpediente"
                    value={expediente.nroexpediente}
                    onChange={handleForms}
                    error={!!errors.nroexpediente}
                    helperText={errors.nroexpediente}
                />
            </Grid>
            <Grid item xs={12} md={5}>
                <TextField
                    label="FECHA"
                    fullWidth
                    margin="dense"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name="fecha"
                    value={expediente.fecha}
                    onChange={handleForms}
                    error={!!errors.fecha}
                    helperText={errors.fecha}
                />
            </Grid>
            <Grid item xs={12}>
                <Autocomplete
                    id="list-customer"
                    options={clientes}
                    getOptionLabel={(option) => option.nombres}
                    value={clientes.find((c) => c.idcliente === expediente.idcliente) || null}
                    onChange={handleAutocompleteCliente}
                    renderInput={(params) => <TextField {...params}
                        label="CLIENTE"
                        size="small"
                        margin="dense"
                        error={!!errors.idcliente}
                        helperText={errors.idcliente}
                    />}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="TEMA"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name="tema"
                    value={expediente.tema}
                    onChange={handleForms}
                    error={!!errors.tema}
                    helperText={errors.tema}
                    inputProps={{ style: { textTransform: 'uppercase' } }}
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
                    inputProps={{ accept: "application/pdf" }}
                    onChange={handleForms}
                    error={!!errors.urlpdf}
                    helperText={errors.urlpdf}
                />
            </Grid>
            <Grid item xs={6} md={3}>
                <LoadingButton loading={loading} fullWidth variant="contained" color="success" startIcon={<Save />} onClick={guardarExpediente}>GUARDAR</LoadingButton>
            </Grid>
            <Grid item xs={6} md={3}>
                <Button fullWidth variant="contained" color="error" startIcon={<Close />} onClick={onCloseDlg}>CANCELAR</Button>
            </Grid>
        </Grid>
    );
}