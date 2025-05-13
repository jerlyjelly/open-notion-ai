export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Replace with your specific frontend URL in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', // Added OPTIONS and GET
}; 