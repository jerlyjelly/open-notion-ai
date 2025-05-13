# Open Notion AI

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), integrated with [Supabase](https://supabase.io) for backend services.

## Project Overview

(TODO: Add a brief description of what your project does here.)

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Database**: [Supabase](https://supabase.io/)
*   **Font**: [Geist](https://vercel.com/font)

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
*   [Supabase CLI](https://supabase.com/docs/guides/cli) (for managing Supabase functions and local development)

## Getting Started & Self-Hosting

Follow these steps to set up and run the project locally or for self-hosting:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/open-notion-ai.git # Replace with your repo URL
cd open-notion-ai
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase

If you don't have one already, create a new project on [Supabase](https://app.supabase.io/).

#### a. Database Setup

*   **Schema**: Any necessary database tables and schema should be set up. If you have SQL migration files (e.g., in a `supabase/migrations` folder), you can apply them using the Supabase dashboard or CLI:
    ```bash
    # If you have local Supabase development setup and linked to your project:
    supabase db push 
    # Or apply migrations via the Supabase dashboard SQL editor.
    ```
    (TODO: If you have specific tables or schema required, list them here or point to your migration files.)

#### b. Environment Variables

Create a `.env` file in the root of your project by copying the example below. You'll need to fill in the values from your Supabase project settings.

**`.env.example` / `.env` content:**

```env
# Supabase Project URL (Found in: Supabase Dashboard > Project Settings > API > Project URL)
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"

# Supabase Anonymous Key (publicly safe) (Found in: Supabase Dashboard > Project Settings > API > Project API keys > anon public)
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Supabase Service Role Key (keep this secret!) 
# Required for administrative tasks, like the delete-user-account Supabase Function.
# (Found in: Supabase Dashboard > Project Settings > API > Project API keys > service_role secret)
# This key should ONLY be used in secure server-side environments (like Supabase Functions) and NEVER exposed to the client.
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"

# Supabase JWT Secret (if you have custom JWT handling or specific Supabase settings requiring it)
# Usually, this is managed internally by Supabase. 
# You can find this in your Supabase project settings: Project Settings > API > JWT Settings > JWT Secret.
# For the delete-user-account function, Supabase's built-in auth.getUser(jwt) relies on this being correctly configured in your Supabase project.
SUPABASE_JWT_SECRET="YOUR_SUPABASE_JWT_SECRET"

# URL of your deployed application (used for CORS in Supabase functions)
# Replace with your actual frontend deployment URL (e.g., https://your-app.vercel.app) 
# or http://localhost:3000 for local development.
APP_URL="http://localhost:3000"
```

**Important Notes on Environment Variables:**

*   `NEXT_PUBLIC_` prefixed variables are exposed to the browser.
*   `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` are highly sensitive and must be kept secret. They are used by Supabase Functions and should be set as environment variables within your Supabase project settings for those functions.

#### c. Configure Supabase Function Environment Variables

The `delete-user-account` Supabase Function requires `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to be set as environment variables within the function's settings on the Supabase dashboard or via the CLI.

1.  Navigate to your Supabase Project > Edge Functions.
2.  Select the `delete-user-account` function.
3.  Go to its Settings or Secrets section and add:
    *   `SUPABASE_URL`: Your project's Supabase URL.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Your project's service role key.
    *   `SUPABASE_JWT_SECRET`: Your project's JWT secret.

#### d. Configure CORS for Supabase Functions

The `supabase/functions/_shared/cors.ts` file defines CORS headers. By default, it might be set to a specific domain (e.g., `https://open-notion-ai.vercel.app/`). 
**You MUST update this for your self-hosted environment.**

Open `supabase/functions/_shared/cors.ts` and change the `Access-Control-Allow-Origin` to your frontend's URL:

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.APP_URL || 'http://localhost:3000', // Or your specific production URL
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, accept',
  'Access-Control-Allow-Methods': 'POST, OPTIONS', 
};
```
It's recommended to use the `APP_URL` environment variable here as well for consistency. You'll need to set `APP_URL` in your Supabase function settings if you use `process.env.APP_URL` directly in the function code, or ensure your build process for functions can inline it if it's determined at build time (less common for Deno functions).

Alternatively, for self-hosting, you might use a wildcard `'*'` for `Access-Control-Allow-Origin` during development, but **this is not recommended for production due to security risks.** Always restrict it to your specific domain(s) in production.

### 4. Deploy Supabase Functions

Deploy the Edge Functions located in the `supabase/functions` directory. 

Ensure you are logged into the Supabase CLI and have linked your local project to your Supabase project:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF # Get YOUR_PROJECT_REF from your Supabase project's URL or settings
```

Then deploy each function:

```bash
# Deploy the delete-user-account function
supabase functions deploy delete-user-account --project-ref YOUR_PROJECT_REF

# Deploy any other functions similarly
# supabase functions deploy <another-function-name> --project-ref YOUR_PROJECT_REF 
```

Make sure the environment variables mentioned in step 3c are set for each function in the Supabase dashboard *before or immediately after* deploying.

### 5. Run the Development Server

Now you can start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To build the Next.js application for production:

```bash
npm run build
```

To run the production build:

```bash
npm run start
```

## Deployment

*   **Next.js Frontend**: Can be deployed to platforms like [Vercel](https://vercel.com/) (recommended for Next.js), Netlify, AWS Amplify, or any Node.js hosting environment.
*   **Supabase Backend**: Supabase handles its own hosting. Ensure your Supabase project is set up correctly as per the instructions above.

## Learn More

To learn more about the technologies used, refer to their official documentation:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Contributing

(TODO: Add your contribution guidelines here if you plan to accept contributions.)

## License

(TODO: Add your project's license information here, e.g., MIT License.)
