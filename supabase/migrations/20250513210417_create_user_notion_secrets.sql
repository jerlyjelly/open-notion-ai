CREATE TABLE public.user_notion_secrets (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_notion_secret TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (user_id)
);

ALTER TABLE public.user_notion_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own notion secret"
ON public.user_notion_secrets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notion secret"
ON public.user_notion_secrets
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notion secret"
ON public.user_notion_secrets
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notion secret"
ON public.user_notion_secrets
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_user_notion_secrets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_notion_secrets_updated
BEFORE UPDATE ON public.user_notion_secrets
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_notion_secrets_updated_at(); 