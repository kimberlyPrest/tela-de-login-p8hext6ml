import { supabase } from '@/lib/supabase/client'
import { Vacancy } from '@/lib/mock-data'

export const mapDbToVacancy = (dbRow: any): Vacancy => ({
  id: dbRow.id,
  title: dbRow.titulo,
  service: dbRow.servico,
  value: Number(dbRow.valor),
  type: dbRow.tipo as any,
  serviceDate: dbRow.data_servico,
  status: dbRow.status as any,
  availability: dbRow.disponibilidade,
  requirements: dbRow.requisitos,
  training: dbRow.treinamento,
  contact: dbRow.contato,
  cep: dbRow.cep_base || undefined,
  distance: dbRow.raio_distancia ? String(dbRow.raio_distancia) : undefined,
  equipmentQuestion: dbRow.perguntas?.equipmentQuestion || '',
  customQuestions: dbRow.perguntas?.customQuestions || [],
})

export const mapVacancyToDb = (vacancy: Partial<Vacancy>) => ({
  titulo: vacancy.title,
  servico: vacancy.service,
  valor: vacancy.value,
  tipo: vacancy.type,
  data_servico: vacancy.serviceDate,
  status: vacancy.status,
  disponibilidade: vacancy.availability,
  requisitos: vacancy.requirements,
  treinamento: vacancy.training,
  contato: vacancy.contact,
  cep_base: vacancy.cep,
  raio_distancia: vacancy.distance ? Number(vacancy.distance) : null,
  perguntas: {
    equipmentQuestion: vacancy.equipmentQuestion,
    customQuestions: vacancy.customQuestions,
  },
})

export const getVagas = async () => {
  const { data, error } = await supabase
    .from('vagas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapDbToVacancy)
}

export const createVaga = async (vaga: Partial<Vacancy>) => {
  const { data, error } = await supabase
    .from('vagas')
    .insert([mapVacancyToDb(vaga)])
    .select()
    .single()
  if (error) throw error
  return mapDbToVacancy(data)
}

export const updateVaga = async (id: string, vaga: Partial<Vacancy>) => {
  const { data, error } = await supabase
    .from('vagas')
    .update(mapVacancyToDb(vaga))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapDbToVacancy(data)
}

export const deleteVaga = async (id: string) => {
  const { error } = await supabase.from('vagas').delete().eq('id', id)
  if (error) throw error
}
