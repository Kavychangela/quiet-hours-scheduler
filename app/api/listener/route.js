import { startSupabaseListener } from '@/lib/supabaseListener';

export async function GET(req) {
  startSupabaseListener(); // starts the listener
  return new Response(JSON.stringify({ ok: true, message: 'Supabase listener started' }), {
    status: 200,
  });
}
