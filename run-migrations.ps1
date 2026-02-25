# Execute Supabase Migrations
# This script helps you run all database migrations

Write-Host "=== GFinder Database Migration Setup ===" -ForegroundColor Green
Write-Host ""

$projectUrl = "https://jjckixmfyfzozablrcfd.supabase.co"
$projectId = "jjckixmfyfzozablrcfd"

Write-Host "Project: $projectUrl" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
$supabaseCLI = Get-Command supabase -ErrorAction SilentlyContinue

if ($supabaseCLI) {
    Write-Host "✅ Supabase CLI detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "Choose migration method:" -ForegroundColor Yellow
    Write-Host "1. Use Supabase CLI (recommended)" -ForegroundColor White
    Write-Host "2. Manual execution via Dashboard" -ForegroundColor White
    Write-Host ""
    $choice = Read-Host "Enter choice (1 or 2)"
    
    if ($choice -eq "1") {
        Write-Host ""
        Write-Host "Running migrations via CLI..." -ForegroundColor Cyan
        
        # Link to project
        Write-Host ""
        Write-Host "Linking to your Supabase project..." -ForegroundColor Yellow
        Write-Host "Project ID: $projectId" -ForegroundColor Cyan
        
        supabase link --project-ref $projectId
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Project linked successfully" -ForegroundColor Green
            Write-Host ""
            Write-Host "Pushing migrations to database..." -ForegroundColor Cyan
            
            supabase db push
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "🎉 All migrations executed successfully!" -ForegroundColor Green
                Write-Host ""
                Write-Host "Your database is ready with:" -ForegroundColor Cyan
                Write-Host "  ✓ User profiles table" -ForegroundColor White
                Write-Host "  ✓ Items table (with search)" -ForegroundColor White
                Write-Host "  ✓ Messages system" -ForegroundColor White
                Write-Host "  ✓ Notifications system" -ForegroundColor White
                Write-Host "  ✓ Saved items" -ForegroundColor White
                Write-Host "  ✓ Reports system" -ForegroundColor White
                Write-Host "  ✓ Statistics views" -ForegroundColor White
                Write-Host ""
            } else {
                Write-Host ""
                Write-Host "❌ Migration failed. Please check errors above." -ForegroundColor Red
                Write-Host "Try manual execution via Dashboard." -ForegroundColor Yellow
            }
        } else {
            Write-Host ""
            Write-Host "❌ Failed to link project. Please check your credentials." -ForegroundColor Red
        }
    } else {
        $choice = "2"
    }
} else {
    Write-Host "⚠️  Supabase CLI not detected" -ForegroundColor Yellow
    Write-Host "Using manual migration method..." -ForegroundColor Cyan
    $choice = "2"
}

if ($choice -eq "2") {
    Write-Host ""
    Write-Host "=== Manual Migration Instructions ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Follow these steps to execute migrations:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Open Supabase Dashboard:" -ForegroundColor White
    Write-Host "   $projectUrl/project/$projectId/sql/new" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Execute SQL files in this order:" -ForegroundColor White
    
    $migrations = Get-ChildItem -Path "supabase\migrations\*.sql" | Sort-Object Name
    
    $i = 1
    foreach ($migration in $migrations) {
        Write-Host "   $i. $($migration.Name)" -ForegroundColor Cyan
        $i++
    }
    
    Write-Host ""
    Write-Host "3. For each file:" -ForegroundColor White
    Write-Host "   a. Open the file from supabase/migrations/" -ForegroundColor Gray
    Write-Host "   b. Copy entire content" -ForegroundColor Gray
    Write-Host "   c. Paste into SQL Editor in Dashboard" -ForegroundColor Gray
    Write-Host "   d. Click 'Run' button" -ForegroundColor Gray
    Write-Host "   e. Verify 'Success' message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. After all migrations:" -ForegroundColor White
    Write-Host "   - Create storage bucket 'item-images' (public)" -ForegroundColor Gray
    Write-Host "   - Enable Realtime for: items, messages, notifications" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Press Enter to open Supabase Dashboard in browser..." -ForegroundColor Yellow
    Read-Host
    
    Start-Process "$projectUrl/project/$projectId/sql/new"
    
    Write-Host ""
    Write-Host "📋 Opening migration files for easy access..." -ForegroundColor Cyan
    
    # Open VS Code with migrations folder
    code "supabase\migrations"
    
    Write-Host ""
    Write-Host "✅ Ready to execute migrations!" -ForegroundColor Green
    Write-Host ""
    Write-Host "After executing all migrations, run: npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Need help? Check BACKEND_SETUP.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
