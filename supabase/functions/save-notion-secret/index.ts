import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from './_shared/cors-headers.ts';

console.log('Save Notion Secret function booting up.');

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
          persistSession: false // Avoid storing session cookies on the server
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

    const body = await req.json();
    const { encryptedNotionSecret } = body;

    if (!encryptedNotionSecret || typeof encryptedNotionSecret !== 'string') {
      console.error('Missing or invalid encryptedNotionSecret in request body:', body);
      return new Response(JSON.stringify({ error: 'Missing or invalid encryptedNotionSecret' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { error: upsertError } = await supabaseClient
      .from('user_notion_secrets')
      .upsert({
        user_id: user.id,
        encrypted_notion_secret: encryptedNotionSecret,
        // created_at is default, updated_at is handled by trigger
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Error upserting Notion secret:', upsertError);
      return new Response(JSON.stringify({ error: 'Database error: ' + upsertError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    console.log(`Notion secret saved successfully for user ${user.id}`);
    return new Response(JSON.stringify({ message: 'Notion secret saved successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Internal server error in save-notion-secret:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}); 