export type VacancyStatus = 'Aberta' | 'Pausada' | 'Encerrada'

export interface Vacancy {
  id: string
  title: string
  department: string
  location: string
  type: string
  datePosted: string
  status: VacancyStatus
  candidatesCount: number
}

export const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Desenvolvedor Frontend Sênior',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'CLT',
    datePosted: '2023-10-24',
    status: 'Aberta',
    candidatesCount: 12,
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Produto',
    location: 'São Paulo, SP',
    type: 'CLT',
    datePosted: '2023-10-22',
    status: 'Aberta',
    candidatesCount: 8,
  },
  {
    id: '3',
    title: 'Analista de Dados Pleno',
    department: 'Dados',
    location: 'Remoto',
    type: 'PJ',
    datePosted: '2023-10-15',
    status: 'Pausada',
    candidatesCount: 45,
  },
  {
    id: '4',
    title: 'Designer UX/UI',
    department: 'Design',
    location: 'Rio de Janeiro, RJ',
    type: 'CLT',
    datePosted: '2023-10-01',
    status: 'Encerrada',
    candidatesCount: 112,
  },
  {
    id: '5',
    title: 'Desenvolvedor Backend Pleno',
    department: 'Engenharia',
    location: 'Remoto',
    type: 'CLT',
    datePosted: '2023-10-25',
    status: 'Aberta',
    candidatesCount: 3,
  },
]
