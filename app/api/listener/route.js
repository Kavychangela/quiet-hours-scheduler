export async function GET() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new Response(JSON.stringify({ ok: false, message: 'Listener skipped at build' }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { startSupabaseListener } = await import('@/lib/supabaseListener.js');
  startSupabaseListener();

  return new Response(JSON.stringify({ ok: true, message: 'Supabase listener started' }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
