# Supabase Setup Script

Write-Host "Starting Supabase setup for GFinder..." -ForegroundColor Green

# Check if Supabase CLI is installed
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabaseInstalled) {
    Write-Host "Supabase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g supabase
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please edit .env file with your Supabase credentials" -ForegroundColor Cyan
    Write-Host "Press any key when ready to continue..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Offer to link to existing project or create new one
Write-Host ""
Write-Host "Do you want to:" -ForegroundColor Cyan
Write-Host "1. Link to existing Supabase project"
Write-Host "2. Create new local Supabase project"
Write-Host "3. Skip (manual setup)"
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Linking to existing project..." -ForegroundColor Yellow
        supabase login
        Write-Host "Enter your project reference ID (found in Supabase Dashboard > Settings > General):"
        $projectRef = Read-Host
        supabase link --project-ref $projectRef
        
        Write-Host ""
        Write-Host "Pushing migrations to Supabase..." -ForegroundColor Yellow
        supabase db push
        
        Write-Host ""
        Write-Host "Setup complete!" -ForegroundColor Green
        Write-Host "Your database has been updated with all migrations."
    }
    "2" {
        Write-Host "Starting local Supabase..." -ForegroundColor Yellow
        supabase init
        supabase start
        
        Write-Host ""
        Write-Host "Local Supabase is running!" -ForegroundColor Green
        Write-Host "API URL: http://localhost:54321"
        Write-Host "Studio URL: http://localhost:54323"
        Write-Host ""
        Write-Host "Update your .env file with:"
        Write-Host "VITE_SUPABASE_URL=http://localhost:54321"
        Write-Host "VITE_SUPABASE_PUBLISHABLE_KEY=<shown in terminal above>"
    }
    "3" {
        Write-Host ""
        Write-Host "Manual setup instructions:" -ForegroundColor Cyan
        Write-Host "1. Go to https://supabase.com and create a project"
        Write-Host "2. Copy your project URL and anon key to .env"
        Write-Host "3. Go to SQL Editor in Supabase Dashboard"
        Write-Host "4. Run each migration file in order from supabase/migrations/"
        Write-Host "5. Create storage bucket 'item-images' (public)"
        Write-Host "6. Configure SMTP settings in Authentication settings"
    }
}

Write-Host ""
Write-Host "Additional setup steps:" -ForegroundColor Yellow
Write-Host "- Configure email templates in Supabase Dashboard > Authentication > Email Templates"
Write-Host "- Set up SMTP for production emails (optional for dev)"
Write-Host "- Enable Realtime for tables: items, messages, notifications"
Write-Host ""
Write-Host "See BACKEND_SETUP.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
Write-Host "Setup complete! Run 'npm run dev' to start the application." -ForegroundColor Green
