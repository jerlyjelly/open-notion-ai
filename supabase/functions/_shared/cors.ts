export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://open-notion-ai.vercel.app', // IMPORTANT: Restrict this in production!
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Ensure POST is allowed for function invocation
}; 