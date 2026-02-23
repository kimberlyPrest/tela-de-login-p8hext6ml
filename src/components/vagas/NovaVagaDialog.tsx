import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  CalendarIcon,
  Plus,
  MapPin,
  Briefcase,
  Trash2,
  Loader2,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Vacancy } from '@/lib/mock-data'
import { useVacancies } from '@/contexts/VacanciesContext'

const formSchema = z
  .object({
    title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres.'),
    service: z.string().min(2, 'O serviço é obrigatório.'),
    value: z.string().min(1, 'O valor é obrigatório.'),
    availability: z.string().min(2, 'A disponibilidade é obrigatória.'),
    requirements: z.string().min(10, 'Descreva os requisitos detalhadamente.'),
    serviceDate: z.date({
      required_error: 'A data do serviço é obrigatória.',
    }),
    training: z.boolean().default(false),
    contact: z.string().min(5, 'O contato é obrigatório.'),
    type: z.enum(['Presencial', 'Home Office'], {
      required_error: 'Selecione o tipo da vaga.',
    }),
    cep: z.string().optional(),
    distance: z.string().optional(),
    equipmentQuestion: z
      .string()
      .min(5, 'A pergunta obrigatória não pode ficar vazia.'),
    customQuestions: z
      .array(
        z.object({
          question: z
            .string()
            .min(3, 'A pergunta deve ter pelo menos 3 caracteres.'),
        }),
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'Presencial') {
      if (!data.cep || data.cep.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O CEP é obrigatório para vagas presenciais.',
          path: ['cep'],
        })
      }
      if (!data.distance || Number(data.distance) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O raio de distância deve ser maior que zero.',
          path: ['distance'],
        })
      }
    }
  })

type FormValues = z.infer<typeof formSchema>

interface NovaVagaDialogProps {
  vacancy?: Vacancy
  customTrigger?: React.ReactNode
}

export function NovaVagaDialog({
  vacancy,
  customTrigger,
}: NovaVagaDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addVacancy, updateVacancy } = useVacancies()

  const isEditMode = !!vacancy

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: vacancy?.title || '',
      service: vacancy?.service || '',
      value: vacancy ? String(vacancy.value) : '',
      availability: vacancy?.availability || '',
      requirements: vacancy?.requirements || '',
      serviceDate: vacancy
        ? new Date(vacancy.serviceDate + 'T12:00:00')
        : undefined,
      training: vacancy?.training || false,
      contact: vacancy?.contact || '',
      type: vacancy?.type || 'Presencial',
      cep: vacancy?.cep || '',
      distance: vacancy?.distance || '',
      equipmentQuestion:
        vacancy?.equipmentQuestion || 'Qual modelo de celular você possui?',
      customQuestions: vacancy?.customQuestions || [],
    },
  })

  const watchType = form.watch('type')

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'customQuestions',
  })

  useEffect(() => {
    if (!isEditMode || watchType !== vacancy?.type) {
      if (watchType === 'Home Office') {
        form.setValue(
          'equipmentQuestion',
          'Qual modelo de notebook/computador você possui?',
        )
      } else {
        form.setValue(
          'equipmentQuestion',
          'Qual modelo de celular você possui?',
        )
      }
    }
  }, [watchType, form, isEditMode, vacancy])

  const onNext = async () => {
    const isValid = await form.trigger([
      'title',
      'service',
      'value',
      'availability',
      'requirements',
      'serviceDate',
      'contact',
      'type',
      'cep',
      'distance',
    ])
    if (isValid) {
      setStep(2)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      const vacancyData = {
        title: data.title,
        service: data.service,
        value: Number(data.value),
        type: data.type as any,
        serviceDate: data.serviceDate.toISOString().split('T')[0],
        availability: data.availability,
        requirements: data.requirements,
        training: data.training,
        contact: data.contact,
        cep: data.cep,
        distance: data.distance,
        equipmentQuestion: data.equipmentQuestion,
        customQuestions: data.customQuestions,
      }

      if (isEditMode && vacancy) {
        await updateVacancy(vacancy.id, vacancyData)
      } else {
        await addVacancy({ status: 'Ativo', ...vacancyData })
      }

      setOpen(false)
      setStep(1)
      if (!isEditMode) {
        form.reset()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
          setStep(1)
          if (!isEditMode) form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button className="w-full sm:w-auto bg-success hover:bg-success/90 text-white shadow-md text-base px-6 py-6 rounded-lg tap-effect border-none">
            <Plus className="mr-2 h-5 w-5" />
            Nova Vaga
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-background border-border shadow-elevation">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
          <DialogHeader className="text-left space-y-0">
            <DialogTitle className="text-xl font-bold text-secondary flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              {isEditMode ? 'Editar Vaga' : 'Criar Nova Vaga'}
            </DialogTitle>
            <DialogDescription className="mt-1 text-muted-foreground">
              {step === 1
                ? 'Preencha os dados essenciais da vaga.'
                : 'Defina as perguntas para os candidatos.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs',
                step === 1
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              1
            </span>
            <div className="w-4 h-px bg-border"></div>
            <span
              className={cn(
                'flex items-center justify-center w-6 h-6 rounded-full text-xs',
                step === 2
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              2
            </span>
          </div>
        </div>

        <div className="px-6 py-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary">
                            Título da Vaga
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Desenvolvedor Front-end"
                              className="focus-visible:ring-accent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary">
                            Serviço
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Engenharia de Software"
                              className="focus-visible:ring-accent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary">
                            Valor (R$)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="focus-visible:ring-accent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="availability"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary">
                            Disponibilidade
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ex: Integral"
                              className="focus-visible:ring-accent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serviceDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col mt-2 md:mt-0">
                          <FormLabel className="mb-[2px] text-secondary">
                            Data do Serviço
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal h-10 border-input hover:bg-transparent hover:border-accent focus-visible:ring-accent',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP', { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-secondary">
                          Requisitos
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descreva as habilidades e experiências necessárias..."
                            className="resize-none h-24 focus-visible:ring-accent"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-t border-border pt-6 mt-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary">
                            Tipo de Vaga
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="focus:ring-accent">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Presencial">
                                Presencial
                              </SelectItem>
                              <SelectItem value="Home Office">
                                Home Office
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary">
                            Contato
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Email ou telefone"
                              className="focus-visible:ring-accent"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {watchType === 'Presencial' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-muted/20 rounded-lg border border-border/60 animate-in fade-in slide-in-from-top-2 duration-300">
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-secondary">
                              <MapPin className="w-4 h-4 text-accent" />
                              CEP Base
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="00000-000"
                                className="focus-visible:ring-accent"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="distance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-secondary">
                              Raio de Distância aceito (km)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Ex: 15"
                                className="focus-visible:ring-accent"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="training"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/80 p-4 shadow-sm bg-card transition-colors hover:border-accent/40">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-semibold text-secondary">
                            Treinamento Fornecido
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            A empresa fornecerá treinamento inicial para esta
                            vaga.
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-secondary flex items-center gap-2 mb-1">
                      Perguntas para o Candidato
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Defina as perguntas que os candidatos deverão responder ao
                      se candidatarem para esta vaga.
                    </p>
                  </div>

                  <div className="p-5 bg-muted/20 rounded-lg border border-border space-y-4">
                    <h4 className="font-semibold text-secondary text-sm uppercase tracking-wider">
                      Pergunta Automática
                    </h4>
                    <FormField
                      control={form.control}
                      name="equipmentQuestion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-secondary flex items-center gap-1">
                            Equipamento Necessário
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="focus-visible:ring-accent bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <h4 className="font-semibold text-secondary text-sm uppercase tracking-wider">
                        Perguntas Personalizadas
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ question: '' })}
                        className="text-primary border-primary/20 hover:bg-primary/10 h-8 text-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Adicionar Pergunta
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {fields.map((item, index) => (
                        <div
                          key={item.id}
                          className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-200"
                        >
                          <div className="mt-2.5 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                            {index + 1}
                          </div>
                          <FormField
                            control={form.control}
                            name={`customQuestions.${index}.question`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    placeholder="Digite a pergunta para o candidato..."
                                    className="focus-visible:ring-accent"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-0.5"
                            title="Remover pergunta"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {fields.length === 0 && (
                        <div className="py-8 text-center bg-muted/10 rounded-lg border border-dashed border-border/60">
                          <p className="text-sm text-muted-foreground">
                            Nenhuma pergunta personalizada adicionada.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Clique em "Adicionar Pergunta" para incluir
                            requisitos específicos.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-5 border-t border-border mt-8">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="border-border hover:bg-muted"
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-secondary"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                )}

                {step === 1 ? (
                  <Button
                    type="button"
                    onClick={onNext}
                    className="bg-primary hover:bg-primary/90 text-white min-w-[120px] shadow-sm tap-effect"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-success hover:bg-success/90 text-white min-w-[120px] shadow-sm tap-effect"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isEditMode ? (
                      'Salvar Vaga'
                    ) : (
                      'Criar Vaga'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
