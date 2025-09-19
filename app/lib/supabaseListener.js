// supabaseListener.js
import { supabase } from './supabaseClient';
import { syncToMongo } from './syncToMongo';

export function startSupabaseListener() {
  supabase
    .channel('public:schedules')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'schedules' },
      (payload) => {
        console.log('Supabase change:', payload);
        syncToMongo(payload);
      }
    )
    .subscribe();
}
