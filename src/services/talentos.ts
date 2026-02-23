import { supabase } from '@/lib/supabase/client'
import { Candidate } from '@/lib/mock-data'

export const mapDbToCandidate = (dbRow: any): Candidate => ({
  id: dbRow.id,
  name: dbRow.nome,
  equipmentType: dbRow.equipamento_tipo as any,
  equipmentModel: dbRow.equipamento_modelo,
  city: dbRow.cidade,
  state: dbRow.estado,
  availability: dbRow.disponibilidade,
  cep: dbRow.cep,
  distance: dbRow.distancia,
  workType: dbRow.tipo as any,
  avatarUrl:
    dbRow.avatar_url ||
    `https://img.usecurling.com/ppl/thumbnail?seed=${dbRow.id}`,
})

export const getTalentos = async () => {
  const { data, error } = await supabase
    .from('talentos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map(mapDbToCandidate)
}
