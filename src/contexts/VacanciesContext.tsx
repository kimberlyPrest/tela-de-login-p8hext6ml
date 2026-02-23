import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react'
import { Vacancy } from '@/lib/mock-data'
import {
  getVagas,
  createVaga as apiCreateVaga,
  updateVaga as apiUpdateVaga,
  deleteVaga as apiDeleteVaga,
} from '@/services/vagas'
import { useAuth } from '@/hooks/use-auth'

interface VacanciesContextType {
  vacancies: Vacancy[]
  loading: boolean
  refresh: () => Promise<void>
  addVacancy: (vacancy: Partial<Vacancy>) => Promise<void>
  updateVacancy: (id: string, data: Partial<Vacancy>) => Promise<void>
  deleteVacancy: (id: string) => Promise<void>
}

const VacanciesContext = createContext<VacanciesContextType | null>(null)

export function VacanciesProvider({ children }: { children: ReactNode }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await getVagas()
      setVacancies(data)
    } catch (error) {
      console.error('Error fetching vacancies:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addVacancy = async (vacancy: Partial<Vacancy>) => {
    const newVaga = await apiCreateVaga(vacancy)
    setVacancies((prev) => [newVaga, ...prev])
  }

  const updateVacancy = async (id: string, data: Partial<Vacancy>) => {
    const updated = await apiUpdateVaga(id, data)
    setVacancies((prev) => prev.map((v) => (v.id === id ? updated : v)))
  }

  const deleteVacancy = async (id: string) => {
    await apiDeleteVaga(id)
    setVacancies((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <VacanciesContext.Provider
      value={{
        vacancies,
        loading,
        refresh,
        addVacancy,
        updateVacancy,
        deleteVacancy,
      }}
    >
      {children}
    </VacanciesContext.Provider>
  )
}

export function useVacancies() {
  const context = useContext(VacanciesContext)
  if (!context) {
    throw new Error('useVacancies must be used within a VacanciesProvider')
  }
  return context
}
