import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('delete-user-account function booting up')

serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase admin client
    const supabaseAdminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Get the user ID from the JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }
    
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(jwt)

    if (userError || !user) {
      console.error('Error getting user from JWT:', userError)
      return new Response(JSON.stringify({ error: 'Failed to identify user for deletion.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log(`Attempting to delete user: ${user.id}`)

    // Delete the user
    const { error: deleteError } = await supabaseAdminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error(`Error deleting user ${user.id}:`, deleteError.message)
      throw deleteError
    }

    console.log(`User ${user.id} deleted successfully`)
    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Unhandled error in delete-user-account function:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

// To deploy: supabase functions deploy delete-user-account --project-ref YOUR_PROJECT_REF
// Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your function's environment variables. 