# Execute Supabase Migrations Script
# This script helps you execute all database migrations in order

Write-Host "=== GFinder Database Migration Tool ===" -ForegroundColor Green
Write-Host ""

# Configuration
$supabaseUrl = "https://jjckixmfyfzozablrcfd.supabase.co"
$projectId = "jjckixmfyfzozablrcfd"
$migrationsPath = ".\supabase\migrations"

Write-Host "Project: $projectId" -ForegroundColor Cyan
Write-Host "Migrations Path: $migrationsPath" -ForegroundColor Cyan
Write-Host ""

# Get all migration files in order
$migrationFiles = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

Write-Host "Found $($migrationFiles.Count) migration files:" -ForegroundColor Yellow
Write-Host ""

foreach ($file in $migrationFiles) {
    Write-Host "  ✓ $($file.Name)" -ForegroundColor White
}

Write-Host ""
Write-Host "=== Execution Options ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Execute via Supabase Dashboard (Recommended)" -ForegroundColor Cyan
Write-Host "  1. Go to: $supabaseUrl/project/$projectId/sql" -ForegroundColor White
Write-Host "  2. Open SQL Editor" -ForegroundColor White
Write-Host "  3. Copy and paste each migration file in order" -ForegroundColor White
Write-Host "  4. Click 'Run' for each migration" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Execute via Supabase CLI" -ForegroundColor Cyan
Write-Host "  1. Install: npm install -g supabase" -ForegroundColor White
Write-Host "  2. Login: supabase login" -ForegroundColor White
Write-Host "  3. Link: supabase link --project-ref $projectId" -ForegroundColor White
Write-Host "  4. Push: supabase db push" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Execute via psql (PostgreSQL CLI)" -ForegroundColor Cyan
Write-Host "  Requires psql installed on your system" -ForegroundColor White
Write-Host ""

Write-Host "Which option would you like to use?" -ForegroundColor Yellow
Write-Host "  1 - Open Supabase Dashboard (will open in browser)"
Write-Host "  2 - Try Supabase CLI (will check if installed)"
Write-Host "  3 - Display migration SQL (copy-paste manually)"
Write-Host "  4 - Exit"
Write-Host ""

$choice = Read-Host "Enter choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Opening Supabase Dashboard..." -ForegroundColor Green
        Start-Process "$supabaseUrl/project/$projectId/sql"
        Write-Host ""
        Write-Host "Manual Steps:" -ForegroundColor Yellow
        Write-Host "1. In the SQL Editor, click 'New Query'" -ForegroundColor White
        Write-Host "2. Copy the content from each migration file below (in order):" -ForegroundColor White
        Write-Host ""
        
        foreach ($file in $migrationFiles) {
            Write-Host "   Migration: $($file.Name)" -ForegroundColor Cyan
            Write-Host "   Path: $($file.FullName)" -ForegroundColor White
            Write-Host ""
        }
        
        Write-Host "3. Paste into SQL Editor and click 'Run'" -ForegroundColor White
        Write-Host "4. Repeat for each migration file" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to display the first migration SQL..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        Write-Host ""
        Write-Host "=== Migration 1: $($migrationFiles[0].Name) ===" -ForegroundColor Green
        Write-Host ""
        Get-Content $migrationFiles[0].FullName | Write-Host -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        Write-Host "Checking for Supabase CLI..." -ForegroundColor Yellow
        
        $supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue
        
        if ($supabaseCli) {
            Write-Host "✓ Supabase CLI found!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Executing migration steps..." -ForegroundColor Yellow
            Write-Host ""
            
            # Check if already linked
            Write-Host "Checking project link..." -ForegroundColor Cyan
            
            # Link project
            Write-Host "Linking to Supabase project..." -ForegroundColor Cyan
            Write-Host "You may need to login if prompted..." -ForegroundColor Yellow
            Write-Host ""
            
            supabase link --project-ref $projectId
            
            Write-Host ""
            Write-Host "Pushing migrations to database..." -ForegroundColor Cyan
            supabase db push
            
            Write-Host ""
            Write-Host "✓ Migrations executed!" -ForegroundColor Green
        } else {
            Write-Host "✗ Supabase CLI not found" -ForegroundColor Red
            Write-Host ""
            Write-Host "To install Supabase CLI:" -ForegroundColor Yellow
            Write-Host "  npm install -g supabase" -ForegroundColor White
            Write-Host ""
            Write-Host "After installation, run this script again and choose option 2." -ForegroundColor White
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "=== All Migration SQL ===" -ForegroundColor Green
        Write-Host ""
        Write-Host "Copy and paste each migration into Supabase SQL Editor in order:" -ForegroundColor Yellow
        Write-Host ""
        
        foreach ($file in $migrationFiles) {
            Write-Host ""
            Write-Host "╔═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
            Write-Host "║ Migration: $($file.Name)" -ForegroundColor Cyan
            Write-Host "╚═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
            Write-Host ""
            
            Get-Content $file.FullName | Write-Host -ForegroundColor White
            
            Write-Host ""
            Write-Host "───────────────────────────────────────────────────────────────────" -ForegroundColor Gray
            Write-Host ""
        }
        
        Write-Host ""
        Write-Host "✓ All migrations displayed" -ForegroundColor Green
        Write-Host ""
        Write-Host "To execute:" -ForegroundColor Yellow
        Write-Host "1. Go to: $supabaseUrl/project/$projectId/sql" -ForegroundColor White
        Write-Host "2. Copy each migration above (one at a time)" -ForegroundColor White
        Write-Host "3. Paste into SQL Editor and click 'Run'" -ForegroundColor White
    }
    
    "4" {
        Write-Host ""
        Write-Host "Exiting..." -ForegroundColor Yellow
        return
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        return
    }
}

Write-Host ""
Write-Host "=== Verification Steps ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "After executing migrations, verify in Supabase Dashboard:" -ForegroundColor White
Write-Host "1. Go to Database > Tables" -ForegroundColor Cyan
Write-Host "2. Check that these tables exist:" -ForegroundColor Cyan
Write-Host "   ✓ items" -ForegroundColor White
Write-Host "   ✓ user_profiles" -ForegroundColor White
Write-Host "   ✓ messages" -ForegroundColor White
Write-Host "   ✓ notifications" -ForegroundColor White
Write-Host "   ✓ saved_items" -ForegroundColor White
Write-Host "   ✓ item_reports" -ForegroundColor White
Write-Host ""
Write-Host "3. Go to Storage > Buckets" -ForegroundColor Cyan
Write-Host "   ✓ Check 'item-images' bucket exists" -ForegroundColor White
Write-Host ""
Write-Host "4. Go to Database > Functions" -ForegroundColor Cyan
Write-Host "   ✓ Check functions are created" -ForegroundColor White
Write-Host ""
Write-Host "Once verified, you can start the development server:" -ForegroundColor Green
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
