import { styled } from '@mui/material/styles';
import { TableCell, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#005187',
        color: theme.palette.common.white,
        fontSize: 13
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        height: '30px', // Ajusta la altura del cuerpo de la celda
        padding: '5px 16px', // Ajusta el relleno según sea necesario
    },
}));