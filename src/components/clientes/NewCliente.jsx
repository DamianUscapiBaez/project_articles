import { Close, Save } from "@mui/icons-material";
import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Config from "../../Config";

export const NewCliente = ({ onCloseDlg, idcliente, listarClientes }) => {
    const [cliente, setCliente] = useState({
        idcliente: 0,
        nombres: ""
    });
    const [errors, setErrors] = useState({
        nombres: ''
    });
    // handle
    const handleForm = (e) => {
        const { name, value } = e.target;
        setCliente({ ...cliente, nombres: value });
        setErrors({ ...errors, [name]: "" });
    }
    // apis
    const guardarCliente = async () => {
        const newErrors = {
            nombres: !cliente.nombres ? 'Este campo es obligatorio' : ''
        };
        setErrors(newErrors);
        if (Object.values(newErrors).every((error) => error === '')) {
            const response = await fetch(`${Config.UrlApi}/clientes/guardarcliente.php`, {
                method: 'POST',
                body: JSON.stringify({
                    idcliente: cliente.idcliente,
                    nombres: cliente.nombres.trim().toUpperCase()
                })
            });
            const data = await response.json();
            if (data.guardado) {
                Swal.fire(
                    'Guardado!',
                    'Se completó exitosamente.',
                    'success'
                );
                onCloseDlg();
                setCliente({
                    idcliente: 0,
                    nombres: ""
                });
                listarClientes();
            } else if (data.guardado === "existe") {
                Swal.fire(
                    "Error",
                    "El articulo ingresado ya se encuentra registrado.",
                    "error"
                );
            }
        }
    }
    // use Effect
    useEffect(() => {
        const recuperarCliente = async (idcliente) => {
            const response = await fetch(`${Config.UrlApi}/clientes/recuperarcliente.php?idcliente=${idcliente}`);
            const data = await response.json();
            setCliente(data);
        }
        if (idcliente !== undefined && idcliente !== "") recuperarCliente(idcliente);
    }, []);
    return (
        <Grid container spacing={2} justifyContent={"center"}>
            <Grid item xs={12}>
                <TextField
                    label="NOMBRE"
                    fullWidth
                    margin="dense"
                    inputProps={{ style: { textTransform: 'uppercase' } }}
                    value={cliente.nombres}
                    onChange={handleForm}
                    error={!!errors.nombres}
                    helperText={errors.nombres}
                />
            </Grid>
            <Grid item xs={6} md={3}>
                <Button fullWidth variant="contained" color="success" startIcon={<Save />} onClick={guardarCliente}>GUARDAR</Button>
            </Grid>
            <Grid item xs={6} md={3}>
                <Button fullWidth variant="contained" color="error" startIcon={<Close />} onClick={onCloseDlg}>CANCELAR</Button>
            </Grid>
        </Grid>
    );
}