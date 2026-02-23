import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'
import Vagas from './pages/vagas/Vagas'
import VagasDetalhes from './pages/vagas/VagasDetalhes'
import BancoTalentos from './pages/banco-talentos/BancoTalentos'
import { AuthProvider } from './contexts/AuthContext'
import { VacanciesProvider } from './contexts/VacanciesContext'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <AuthProvider>
      <VacanciesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/vagas" element={<Vagas />} />
              <Route path="/vagas/:id" element={<VagasDetalhes />} />
              <Route path="/banco-talentos" element={<BancoTalentos />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </VacanciesProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
