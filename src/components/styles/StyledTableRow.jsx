import { styled } from '@mui/material/styles';
import { TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "#C4DAFA",
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));