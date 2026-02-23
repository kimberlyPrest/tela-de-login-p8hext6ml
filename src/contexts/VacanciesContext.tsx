import { createContext, useContext, useState, ReactNode } from 'react'
import { Vacancy, mockVacancies } from '@/lib/mock-data'

interface VacanciesContextType {
  vacancies: Vacancy[]
  addVacancy: (vacancy: Vacancy) => void
  updateVacancy: (id: string, data: Partial<Vacancy>) => void
  deleteVacancy: (id: string) => void
}

const VacanciesContext = createContext<VacanciesContextType | null>(null)

export function VacanciesProvider({ children }: { children: ReactNode }) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(mockVacancies)

  const addVacancy = (vacancy: Vacancy) => {
    setVacancies((prev) => [vacancy, ...prev])
  }

  const updateVacancy = (id: string, data: Partial<Vacancy>) => {
    setVacancies((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data } : v)),
    )
  }

  const deleteVacancy = (id: string) => {
    setVacancies((prev) => prev.filter((v) => v.id !== id))
  }

  return (
    <VacanciesContext.Provider
      value={{ vacancies, addVacancy, updateVacancy, deleteVacancy }}
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
