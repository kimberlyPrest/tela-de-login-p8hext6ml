import { useState, useMemo } from 'react'
import {
  Briefcase,
  Calendar,
  ChevronDown,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockVacancies, Vacancy, VacancyStatus } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function Vagas() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<VacancyStatus | 'Todas'>(
    'Todas',
  )

  const filteredVacancies = useMemo(() => {
    return mockVacancies.filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.department.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'Todas' || v.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [searchTerm, statusFilter])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight">
            Dashboard de Vagas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todas as oportunidades e processos seletivos.
          </p>
        </div>
        <Button className="hidden md:flex bg-gradient-primary shadow-md hover:shadow-lg tap-effect text-white">
          <Plus className="mr-2 h-4 w-4" />
          Criar Vaga
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Vagas Ativas"
          value="12"
          icon={Briefcase}
          trend="+2 na última semana"
        />
        <SummaryCard
          title="Novos Candidatos"
          value="48"
          icon={Users}
          trend="+15% este mês"
        />
        <SummaryCard
          title="Entrevistas Hoje"
          value="5"
          icon={Calendar}
          trend="Agendadas para hoje"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center bg-card p-2 rounded-lg border border-border/50 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cargo ou departamento..."
            className="pl-9 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:block w-[1px] h-8 bg-border"></div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as VacancyStatus | 'Todas')}
        >
          <SelectTrigger className="w-full sm:w-[180px] border-0 bg-transparent focus:ring-0">
            <SelectValue placeholder="Status da vaga" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas as vagas</SelectItem>
            <SelectItem value="Aberta">Abertas</SelectItem>
            <SelectItem value="Pausada">Pausadas</SelectItem>
            <SelectItem value="Encerrada">Encerradas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredVacancies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVacancies.map((vacancy, index) => (
            <div
              key={vacancy.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both',
              }}
            >
              <VacancyCard vacancy={vacancy} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-card/50">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-secondary">
            Nenhuma vaga encontrada
          </h3>
          <p className="text-muted-foreground max-w-sm mt-2 mb-6">
            Tente ajustar os filtros ou os termos da busca para encontrar o que
            procura.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('Todas')
            }}
          >
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      <Button className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevation bg-accent hover:bg-accent/90 text-white p-0 z-50 tap-effect">
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  icon: any
  trend: string
}) {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-bold text-secondary mt-1">{value}</h4>
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const statusStyles = {
    Aberta: 'bg-success/15 text-success hover:bg-success/25 border-success/20',
    Pausada:
      'bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20',
    Encerrada: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-border/60">
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <Badge
            variant="outline"
            className={cn(
              'font-medium rounded-md',
              statusStyles[vacancy.status],
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full mr-1.5',
                vacancy.status === 'Aberta'
                  ? 'bg-success'
                  : vacancy.status === 'Pausada'
                    ? 'bg-amber-500'
                    : 'bg-muted-foreground',
              )}
            />
            {vacancy.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -mr-2 text-muted-foreground hover:text-secondary"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Editar vaga</DropdownMenuItem>
              <DropdownMenuItem>Pausar processo</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Encerrar vaga
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-lg text-secondary line-clamp-2 mb-1">
          {vacancy.title}
        </h3>
        <p className="text-sm text-primary font-medium mb-4">
          {vacancy.department}
        </p>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 opacity-70" />
            {vacancy.location} • {vacancy.type}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 opacity-70" />
            Postada em{' '}
            {new Date(vacancy.datePosted).toLocaleDateString('pt-BR')}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2 opacity-70" />
            <span className="font-medium text-foreground">
              {vacancy.candidatesCount}
            </span>{' '}
            &nbsp;candidatos
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-5 text-primary border-primary/20 hover:bg-primary/5 group"
        >
          Ver Detalhes
          <ChevronDown className="h-4 w-4 ml-1 -rotate-90 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  )
}
