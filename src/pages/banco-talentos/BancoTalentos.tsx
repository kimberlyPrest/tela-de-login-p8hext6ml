import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  MapPin,
  Laptop,
  Smartphone,
  Filter,
  Send,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Slider } from '@/components/ui/slider'
import { Candidate } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { getTalentos } from '@/services/talentos'
import { createConvite } from '@/services/convites'
import { useVacancies } from '@/contexts/VacanciesContext'

export default function BancoTalentos() {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const { vacancies } = useVacancies()

  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])

  const initialVagaId = searchParams.get('vagaId') || ''
  const [selectedVagaId, setSelectedVagaId] = useState(initialVagaId)

  const [filterType, setFilterType] = useState<string>('all')
  const [filterEquipment, setFilterEquipment] = useState<string>('')
  const [filterDistance, setFilterDistance] = useState<number[]>([500])
  const [searchName, setSearchName] = useState<string>('')

  useEffect(() => {
    if (!selectedVagaId && vacancies.length > 0) {
      setSelectedVagaId(vacancies[0].id)
    }
  }, [vacancies, selectedVagaId])

  useEffect(() => {
    const fetchTalentos = async () => {
      try {
        const data = await getTalentos()
        setCandidates(data)
      } catch (e) {
        console.error(e)
        toast({
          title: 'Erro',
          description: 'Erro ao carregar talentos',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTalentos()
  }, [toast])

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      if (
        searchName &&
        !candidate.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false
      }

      if (filterType !== 'all' && candidate.workType !== filterType) {
        return false
      }

      if (
        filterEquipment &&
        !candidate.equipmentType
          .toLowerCase()
          .includes(filterEquipment.toLowerCase()) &&
        !candidate.equipmentModel
          .toLowerCase()
          .includes(filterEquipment.toLowerCase())
      ) {
        return false
      }

      if (candidate.distance > filterDistance[0]) {
        return false
      }

      return true
    })
  }, [filterType, filterEquipment, filterDistance, searchName, candidates])

  const handleInvite = async (candidate: Candidate) => {
    if (!selectedVagaId) {
      toast({
        title: 'Aviso',
        description: 'Selecione uma vaga alvo para enviar o convite.',
        variant: 'destructive',
      })
      return
    }

    try {
      await createConvite({
        vaga_id: selectedVagaId,
        talento_id: candidate.id,
        link_unico: `${window.location.origin}/candidatura/${Math.random().toString(36).substring(7)}`,
      })
      toast({
        title: 'Convite Enviado!',
        description: `Um convite para a vaga foi enviado para ${candidate.name}.`,
      })
    } catch (e) {
      toast({
        title: 'Erro',
        description:
          'Não foi possível enviar o convite. Pode já existir um para este candidato.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row mb-8 justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#04586f] tracking-tight">
            Banco de Talentos
          </h1>
          <p className="text-[#575c5c] mt-1.5">
            Visualize, filtre e convide os melhores profissionais para suas
            vagas.
          </p>
        </div>

        {vacancies.length > 0 && (
          <div className="w-full sm:w-72">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">
              Vaga alvo para os convites:
            </label>
            <Select value={selectedVagaId} onValueChange={setSelectedVagaId}>
              <SelectTrigger className="bg-card shadow-sm border-border focus:ring-[#04b5b1]">
                <SelectValue placeholder="Selecione a vaga" />
              </SelectTrigger>
              <SelectContent>
                {vacancies.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card className="mb-8 border-border shadow-sm bg-card/60 backdrop-blur-sm">
        <CardHeader className="bg-muted/20 border-b border-border pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-[#04586f]">
            <Filter className="h-5 w-5 text-[#04b5b1]" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#575c5c]">
                Buscar por nome
              </label>
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#048a94]" />
                <Input
                  placeholder="Nome do candidato..."
                  className="pl-9 focus-visible:ring-[#04b5b1] focus-visible:border-[#04b5b1]"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#575c5c]">
                Tipo de Vaga
              </label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="focus:ring-[#04b5b1]">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="Home Office">Home Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#575c5c]">
                Equipamento
              </label>
              <div className="relative group">
                <Laptop className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#048a94]" />
                <Input
                  placeholder="Ex: Notebook, iPhone..."
                  className="pl-9 focus-visible:ring-[#04b5b1] focus-visible:border-[#04b5b1]"
                  value={filterEquipment}
                  onChange={(e) => setFilterEquipment(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-[#575c5c]">
                  Raio de distância
                </label>
                <span className="text-sm font-semibold text-[#048a94] bg-[#04b5b1]/10 px-2 py-0.5 rounded">
                  {filterDistance[0]} km
                </span>
              </div>
              <Slider
                defaultValue={[500]}
                max={500}
                step={10}
                value={filterDistance}
                onValueChange={setFilterDistance}
                className="py-1.5 [&_[role=slider]]:border-[#048a94] [&_[role=slider]]:focus-visible:ring-[#04b5b1] [&_.bg-primary]:bg-[#048a94]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden bg-card/80">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[#04586f]">
                  Candidato
                </TableHead>
                <TableHead className="font-semibold text-[#04586f]">
                  Equipamento
                </TableHead>
                <TableHead className="font-semibold text-[#04586f]">
                  Localização
                </TableHead>
                <TableHead className="font-semibold text-[#04586f]">
                  Perfil
                </TableHead>
                <TableHead className="font-semibold text-[#04586f] text-right">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate, index) => (
                  <TableRow
                    key={candidate.id}
                    className="hover:bg-muted/20 animate-in fade-in slide-in-from-bottom-2"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-10 w-10 border border-[#048a94]/20 shadow-sm">
                          <AvatarImage
                            src={candidate.avatarUrl}
                            alt={candidate.name}
                          />
                          <AvatarFallback className="bg-[#04b5b1]/10 text-[#048a94] font-semibold">
                            {candidate.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-secondary">
                            {candidate.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-secondary flex items-center gap-1.5">
                          {candidate.equipmentType === 'Notebook' ? (
                            <Laptop className="h-3.5 w-3.5 text-[#048a94]" />
                          ) : (
                            <Smartphone className="h-3.5 w-3.5 text-[#048a94]" />
                          )}
                          {candidate.equipmentType}
                        </span>
                        <span className="text-xs text-[#575c5c] font-medium mt-0.5">
                          {candidate.equipmentModel}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-secondary">
                          {candidate.city} - {candidate.state}
                        </span>
                        <span className="text-xs text-[#575c5c] font-medium flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1 text-[#04b5b1]" />
                          CEP: {candidate.cep} • {candidate.distance} km
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5 items-start">
                        <Badge
                          variant="outline"
                          className="bg-[#04b5b1]/10 text-[#04586f] border-[#04b5b1]/20 font-medium"
                        >
                          {candidate.workType}
                        </Badge>
                        <span className="text-xs text-[#575c5c] font-medium bg-muted/50 px-2 py-0.5 rounded-sm">
                          {candidate.availability}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleInvite(candidate)}
                        className="bg-[#34a888] hover:bg-[#2c8f73] text-white shadow-sm tap-effect"
                        size="sm"
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Convidar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-20" />
                      <p className="font-medium">Nenhum candidato encontrado</p>
                      <p className="text-sm">
                        Tente ajustar os filtros de busca
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
