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
  availability: string
  requirements: string
  training: boolean
  contact: string
  cep?: string
  distance?: string
  equipmentQuestion: string
  customQuestions: { question: string }[]
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
    availability: 'Integral (Segunda a Sexta)',
    requirements:
      '• Experiência comprovada em AWS e Azure\n• Conhecimento avançado em Terraform e Kubernetes\n• Inglês fluente para conversação\n• Certificação AWS Solutions Architect é um diferencial.',
    training: true,
    contact: 'tech.recruiting@empresa.com',
    equipmentQuestion: 'Qual modelo de notebook/computador você possui?',
    customQuestions: [
      { question: 'Possui alguma certificação cloud ativa? Qual?' },
      {
        question:
          'Qual foi o maior desafio de infraestrutura que você já resolveu?',
      },
    ],
  },
  {
    id: '2',
    title: 'Desenvolvimento de MVP',
    service: 'Engenharia de Software',
    value: 25000,
    type: 'Home Office',
    serviceDate: '2024-04-01',
    status: 'Ativo',
    availability: 'Flexível',
    requirements:
      '• Domínio de React, Node.js e TypeScript\n• Experiência prévia na construção de produtos do zero\n• Conhecimento em banco de dados relacionais e NoSQL\n• Foco em entrega de valor e agilidade.',
    training: false,
    contact: 'produto@startup.io',
    equipmentQuestion: 'Qual modelo de notebook/computador você possui?',
    customQuestions: [
      { question: 'Compartilhe o link do seu GitHub ou portfólio.' },
    ],
  },
  {
    id: '3',
    title: 'Design de Interface App',
    service: 'UX/UI Design',
    value: 8000,
    type: 'Presencial',
    serviceDate: '2024-03-20',
    status: 'Inativo',
    availability: 'Parcial (Tardes)',
    requirements:
      '• Portfólio focado em aplicativos mobile (iOS e Android)\n• Domínio do Figma e criação de Design Systems\n• Boa capacidade de comunicação com desenvolvedores\n• Residir na região metropolitana.',
    training: true,
    contact: 'design.team@agencia.com',
    cep: '01310-100',
    distance: '15',
    equipmentQuestion: 'Qual modelo de celular você possui?',
    customQuestions: [
      { question: 'Você tem experiência com testes de usabilidade?' },
    ],
  },
  {
    id: '4',
    title: 'Otimização de Banco de Dados',
    service: 'Database Admin',
    value: 15000,
    type: 'Presencial',
    serviceDate: '2024-04-10',
    status: 'Ativo',
    availability: 'Integral',
    requirements:
      '• Especialista em PostgreSQL e performance tuning\n• Experiência com migração de grandes volumes de dados\n• Conhecimento em rotinas de backup e disaster recovery.',
    training: false,
    contact: 'infra@datacenter.net',
    cep: '04538-132',
    distance: '30',
    equipmentQuestion: 'Qual modelo de celular você possui?',
    customQuestions: [],
  },
]
