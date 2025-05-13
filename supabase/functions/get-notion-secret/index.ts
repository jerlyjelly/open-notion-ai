import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './_shared/cors-headers.ts';

console.log('Get Notion Secret function booting up.');

serve(async (req: Request) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
        auth: {
          persistSession: false
        }
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Authentication failed: ' + authError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    if (!user) {
      console.error('User not authenticated.');
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { data, error: selectError } = await supabaseClient
      .from('user_notion_secrets')
      .select('encrypted_notion_secret')
      .eq('user_id', user.id)
      .single(); // Expecting only one row or null

    if (selectError) {
      if (selectError.code === 'PGRST116') { // PostgREST error for "No rows found"
        console.log(`No Notion secret found for user ${user.id}`);
        return new Response(JSON.stringify({ encryptedNotionSecret: null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Or 404 if preferred, but 200 with null is also common
        });
      }
      console.error('Error fetching Notion secret:', selectError);
      return new Response(JSON.stringify({ error: 'Database error: ' + selectError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    if (!data) {
      console.log(`No Notion secret found for user ${user.id} (data is null).`);
      return new Response(JSON.stringify({ encryptedNotionSecret: null }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    console.log(`Notion secret retrieved for user ${user.id}`);
    return new Response(JSON.stringify({ encryptedNotionSecret: data.encrypted_notion_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Internal server error in get-notion-secret:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 