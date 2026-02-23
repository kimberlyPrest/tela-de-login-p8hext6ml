import { supabase } from '@/lib/supabase/client'

export const createConvite = async (convite: {
  vaga_id: string
  talento_id: string
  link_unico: string
}) => {
  const { data, error } = await supabase
    .from('convites')
    .insert([convite])
    .select()
    .single()
  if (error) throw error
  return data
}
