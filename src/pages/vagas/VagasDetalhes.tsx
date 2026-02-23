import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Monitor,
  Briefcase,
  Clock,
  CheckCircle2,
  Search,
  Mail,
  Edit,
  Loader2,
} from 'lucide-react'
import { useVacancies } from '@/contexts/VacanciesContext'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { NovaVagaDialog } from '@/components/vagas/NovaVagaDialog'
import { cn } from '@/lib/utils'

export default function VagasDetalhes() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { vacancies, loading } = useVacancies()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  const vacancy = vacancies.find((v) => v.id === id)

  if (!vacancy) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">
          Vaga não encontrada
        </h2>
        <Button onClick={() => navigate('/vagas')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Vagas
        </Button>
      </div>
    )
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

  const statusStyles = {
    Ativo: 'bg-success/15 text-success border-success/20',
    Inativo: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/vagas')}
          className="text-muted-foreground hover:text-secondary -ml-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Vagas
        </Button>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary tracking-tight">
              {vacancy.title}
            </h1>
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
          </div>
          <div className="flex items-center text-accent font-medium">
            <Briefcase className="h-4 w-4 mr-2" />
            {vacancy.service}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <NovaVagaDialog
            vacancy={vacancy}
            customTrigger={
              <Button
                variant="outline"
                className="w-full sm:w-auto border-border shadow-sm"
              >
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
            }
          />
          <Button
            onClick={() => navigate(`/banco-talentos?vagaId=${vacancy.id}`)}
            className="w-full sm:w-auto bg-[#04b5b1] hover:bg-[#048a94] text-white shadow-md tap-effect border-none"
          >
            <Search className="mr-2 h-4 w-4" /> Buscar no Banco de Talentos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informações Gerais */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Informações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Valor
                  </p>
                  <div className="flex items-center text-lg font-semibold text-secondary">
                    <DollarSign className="h-5 w-5 mr-1 text-primary" />
                    {formatCurrency(vacancy.value)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Data do Serviço
                  </p>
                  <div className="flex items-center text-lg font-semibold text-secondary">
                    <Calendar className="h-5 w-5 mr-1 text-primary" />
                    {formatDate(vacancy.serviceDate)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Disponibilidade
                  </p>
                  <div className="flex items-center text-secondary font-medium">
                    {vacancy.availability}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Contato
                  </p>
                  <div className="flex items-center text-secondary font-medium">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {vacancy.contact}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requisitos */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Requisitos e Descrição
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="whitespace-pre-wrap text-secondary/90 leading-relaxed">
                {vacancy.requirements}
              </div>

              <Separator className="my-6" />

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                <div>
                  <p className="font-semibold text-secondary">
                    Treinamento Fornecido
                  </p>
                  <p className="text-sm text-muted-foreground">
                    A empresa oferece capacitação inicial?
                  </p>
                </div>
                <Badge
                  variant={vacancy.training ? 'default' : 'secondary'}
                  className="px-3 py-1 text-sm"
                >
                  {vacancy.training ? 'Sim, incluso' : 'Não'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Questionário */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border">
              <CardTitle className="text-xl flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Perguntas aos Candidatos
              </CardTitle>
              <CardDescription>
                Questionário exigido no momento da candidatura
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
                    Equipamento Necessário (Automática)
                  </p>
                  <p className="text-secondary font-medium">
                    {vacancy.equipmentQuestion}
                  </p>
                </div>
              </div>

              {vacancy.customQuestions.map((q, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-card border border-border shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-bold shrink-0">
                    {index + 2}
                  </div>
                  <div>
                    <p className="text-secondary font-medium">{q.question}</p>
                  </div>
                </div>
              ))}

              {vacancy.customQuestions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                  Nenhuma pergunta personalizada adicional.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Logistics */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm overflow-hidden sticky top-24">
            <CardHeader className="bg-muted/20 border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                {vacancy.type === 'Presencial' ? (
                  <MapPin className="h-5 w-5 text-primary" />
                ) : (
                  <Monitor className="h-5 w-5 text-primary" />
                )}
                Logística
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Tipo de Vaga
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-md bg-primary/10 text-primary font-semibold">
                  {vacancy.type}
                </div>
              </div>

              {vacancy.type === 'Presencial' && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      CEP Base
                    </p>
                    <p className="text-secondary font-medium">
                      {vacancy.cep || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Raio de Distância Aceito
                    </p>
                    <p className="text-secondary font-medium">
                      Até {vacancy.distance || '0'} km
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
