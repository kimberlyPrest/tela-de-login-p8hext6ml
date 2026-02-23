export type VacancyStatus = 'Ativo' | 'Inativo'
export type VacancyType = 'Presencial' | 'Home Office'

export interface Vacancy {
  id: string
  title: string
  service: string
  value: number
  type: VacancyType
  serviceDate: string
  status: VacancyStatus
}

export const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Consultoria de Infraestrutura',
    service: 'Arquitetura Cloud',
    value: 12500,
    type: 'Home Office',
    serviceDate: '2024-03-15',
    status: 'Ativo',
  },
  {
    id: '2',
    title: 'Desenvolvimento de MVP',
    service: 'Engenharia de Software',
    value: 25000,
    type: 'Home Office',
    serviceDate: '2024-04-01',
    status: 'Ativo',
  },
  {
    id: '3',
    title: 'Design de Interface App',
    service: 'UX/UI Design',
    value: 8000,
    type: 'Presencial',
    serviceDate: '2024-03-20',
    status: 'Inativo',
  },
  {
    id: '4',
    title: 'Otimização de Banco de Dados',
    service: 'Database Admin',
    value: 15000,
    type: 'Presencial',
    serviceDate: '2024-04-10',
    status: 'Ativo',
  },
]
