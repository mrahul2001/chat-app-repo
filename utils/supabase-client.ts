import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '@/types/supabase'

// Client-side Supabase client (for Client Components)
export const createBrowserSupabaseClient = () => {
  return createClientComponentClient<Database>()
} 