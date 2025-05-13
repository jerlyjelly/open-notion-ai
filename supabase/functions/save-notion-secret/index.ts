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

    // Check if the user_notion_secrets table exists, if not create it
    const { data: tableExists, error: checkTableError } = await supabaseClient.rpc(
      'check_table_exists',
      { table_name: 'user_notion_secrets', schema_name: 'public' }
    );

    if (checkTableError) {
      // If the RPC function doesn't exist, create it first
      await supabaseClient.rpc('create_check_table_exists_function').catch(async (err) => {
        // Create the function manually if the RPC call fails
        await supabaseClient.sql(`
          CREATE OR REPLACE FUNCTION check_table_exists(table_name text, schema_name text DEFAULT 'public')
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            exists_val boolean;
          BEGIN
            SELECT EXISTS (
              SELECT FROM information_schema.tables
              WHERE table_schema = schema_name AND table_name = $1
            ) INTO exists_val;
            RETURN exists_val;
          END;
          $$;
        `);
      });

      // Try the check again after creating the function
      const { data: retryTableExists } = await supabaseClient.rpc(
        'check_table_exists',
        { table_name: 'user_notion_secrets', schema_name: 'public' }
      ).catch(() => ({ data: false }));
      
      if (retryTableExists === false) {
        // Table doesn't exist, create it
        try {
          console.log('Creating user_notion_secrets table...');
          await supabaseClient.sql(`
            CREATE TABLE IF NOT EXISTS public.user_notion_secrets (
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              encrypted_notion_secret TEXT NOT NULL,
              created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
              updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
              PRIMARY KEY (user_id)
            );

            ALTER TABLE public.user_notion_secrets ENABLE ROW LEVEL SECURITY;

            CREATE POLICY IF NOT EXISTS "Users can insert their own notion secret"
            ON public.user_notion_secrets
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);

            CREATE POLICY IF NOT EXISTS "Users can view their own notion secret"
            ON public.user_notion_secrets
            FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);

            CREATE POLICY IF NOT EXISTS "Users can update their own notion secret"
            ON public.user_notion_secrets
            FOR UPDATE
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);

            CREATE POLICY IF NOT EXISTS "Users can delete their own notion secret"
            ON public.user_notion_secrets
            FOR DELETE
            TO authenticated
            USING (auth.uid() = user_id);

            -- Only create trigger function if it doesn't exist
            DO $$
            BEGIN
              IF NOT EXISTS (SELECT * FROM pg_proc WHERE proname = 'handle_user_notion_secrets_updated_at') THEN
                CREATE OR REPLACE FUNCTION public.handle_user_notion_secrets_updated_at()
                RETURNS TRIGGER AS $$
                BEGIN
                  NEW.updated_at = timezone('utc'::text, now());
                  RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
              END IF;
            END $$;

            -- Drop the trigger if it exists and recreate to ensure it works correctly
            DROP TRIGGER IF EXISTS on_user_notion_secrets_updated ON public.user_notion_secrets;
            CREATE TRIGGER on_user_notion_secrets_updated
            BEFORE UPDATE ON public.user_notion_secrets
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_user_notion_secrets_updated_at();
          `);
          console.log('Successfully created user_notion_secrets table with RLS policies');
        } catch (createTableError) {
          console.error('Error creating table:', createTableError);
          return new Response(JSON.stringify({ 
            error: 'Could not verify or create required database table',
            details: createTableError
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
        }
      }
    }

    // Continue with the regular flow - process the request
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
      console.error('--- Raw Upsert Error Inspection Start ---');
      console.error('Direct log of upsertError:', upsertError);
      try {
        console.error('Simple JSON.stringify(upsertError):', JSON.stringify(upsertError));
      } catch (e) {
        console.error('Could not simple JSON.stringify upsertError:', e);
      }
      try {
        console.error('JSON.stringify with getOwnPropertyNames (upsertError):', JSON.stringify(upsertError, Object.getOwnPropertyNames(upsertError)));
      } catch (e) {
        console.error('Could not JSON.stringify with getOwnPropertyNames upsertError:', e);
      }
      console.error('upsertError.message:', upsertError.message || 'N/A');
      console.error('upsertError.code:', upsertError.code || 'N/A');
      console.error('upsertError.details:', upsertError.details || 'N/A');
      console.error('upsertError.hint:', upsertError.hint || 'N/A');
      console.error('--- Raw Upsert Error Inspection End ---');

      return new Response(JSON.stringify({
        error: 'Database error during save. Check function logs for details. Message: ' + (upsertError.message || 'N/A'),
        code: upsertError.code || 'UNKNOWN',
      }), {
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