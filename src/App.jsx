import { HashRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { ArticlesCrud } from './components/documentos/ArticlesCrud'
import { ExpedientesCrud } from './components/expedientes/ExpedientesCrud'
import { Home } from './Home'
import { Box } from '@mui/material'
import { Navbar } from './Navbar'
const drawerWidth = 240;

function App() {

  return (
    <HashRouter>
      <Box sx={{ display: 'flex' }}>
        <Navbar drawerWidth={drawerWidth} />
        <Box component="main"
          sx={{
            flexGrow: 1,
            mt: 7,
            width: { sm: `calc(100% - ${drawerWidth}px)` }
          }}>
          <Routes>
            {/* expedientes */}
            <Route path="/" exact element={<Home />} />
            <Route path="/documentos" exact element={<ArticlesCrud />} />
            {/* expedientes */}
            <Route path="/expedientes" exact element={<ExpedientesCrud />} />
          </Routes>
        </Box>
      </Box>
    </HashRouter>
  )
}

export default App
