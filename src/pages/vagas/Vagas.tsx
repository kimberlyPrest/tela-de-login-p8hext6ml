import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  DollarSign,
  MapPin,
  Monitor,
  ArrowRight,
  MoreVertical,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Vacancy } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { NovaVagaDialog } from '@/components/vagas/NovaVagaDialog'
import { useVacancies } from '@/contexts/VacanciesContext'

export default function Vagas() {
  const { vacancies } = useVacancies()

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 bg-card p-6 rounded-xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary tracking-tight">
            Vagas e Oportunidades
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Gerencie todas as vagas de serviço e acompanhe o status de cada
            oportunidade.
          </p>
        </div>
        <NovaVagaDialog />
      </div>

      {/* Vacancy Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {vacancies.map((vacancy, index) => (
          <div
            key={vacancy.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both',
            }}
          >
            <VacancyCard vacancy={vacancy} />
          </div>
        ))}
      </div>
    </div>
  )
}

function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const navigate = useNavigate()

  const statusStyles = {
    Ativo: 'bg-success/15 text-success border-success/20',
    Inativo: 'bg-muted text-muted-foreground border-border',
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T12:00:00')
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleCardClick = () => {
    navigate(`/vagas/${vacancy.id}`)
  }

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Card
      onClick={handleCardClick}
      className="flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/80 bg-card/50 overflow-hidden group cursor-pointer"
    >
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-5">
          <Badge
            variant="outline"
            className={cn(
              'font-medium rounded-full px-3 py-1 shadow-sm',
              statusStyles[vacancy.status],
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full mr-2',
                vacancy.status === 'Ativo'
                  ? 'bg-success animate-pulse'
                  : 'bg-muted-foreground',
              )}
            />
            {vacancy.status}
          </Badge>
          <div onClick={handleMenuClick}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2 text-muted-foreground hover:text-secondary focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate(`/vagas/${vacancy.id}`)}
                >
                  Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Duplicar oportunidade
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                  Excluir vaga
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-xl text-secondary line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors">
            {vacancy.title}
          </h3>
          <div className="inline-flex items-center text-sm font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-md">
            <Briefcase className="h-3.5 w-3.5 mr-1.5" />
            {vacancy.service}
          </div>
        </div>

        <div className="space-y-3.5 mt-auto bg-background/50 rounded-lg p-4 border border-border/50">
          <div className="flex items-center text-sm">
            <div className="bg-primary/10 p-1.5 rounded-md mr-3 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Valor</p>
              <span className="font-semibold text-secondary">
                {formatCurrency(vacancy.value)}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <div className="bg-primary/10 p-1.5 rounded-md mr-3 text-primary">
              {vacancy.type === 'Presencial' ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Tipo</p>
              <span className="font-medium text-secondary">{vacancy.type}</span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <div className="bg-primary/10 p-1.5 rounded-md mr-3 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Data do Serviço
              </p>
              <span className="font-medium text-secondary">
                {formatDate(vacancy.serviceDate)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t border-border/50 bg-muted/10 mt-auto">
        <Button
          variant="ghost"
          className="w-full text-primary hover:text-primary hover:bg-primary/10 font-medium group/btn"
        >
          Ver Detalhes completos
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  )
}
