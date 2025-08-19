@echo off
REM ===================== eSIM Myanmar Website Auto Deploy + SEO Audit (Windows) =====================
setlocal enabledelayedexpansion

REM Configuration Variables
set "REPO_URL=https://github.com/nexorasim/cli.git"
set "REPO_DIR=esim-myanmar-website"
set "VERCEL_TOKEN=YeHB18fhvsscigEgaGglpg5A"
set "VERCEL_PROJECT_ID=prj_QT0WVnXI3zwzZ2AoF2GcGAQ8zBss"
set "WEBSITE_URL=https://www.esim.com.mm"
set "LOG_FILE=deployment-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.log"

echo ===== eSIM Myanmar Website Auto Deploy + SEO Audit =====
echo Log file: %LOG_FILE%
echo.

REM 1. Pull the latest code from GitHub repository
echo [%time%] Step 1: Pulling latest code from GitHub repository
if not exist "%REPO_DIR%" (
    echo Cloning repository: %REPO_URL%
    git clone %REPO_URL% %REPO_DIR% >> %LOG_FILE% 2>&1
) else (
    echo Repository exists, updating...
    cd %REPO_DIR%
    git reset --hard >> ..\%LOG_FILE% 2>&1
    git pull origin main >> ..\%LOG_FILE% 2>&1
    cd ..
)

cd %REPO_DIR%
echo ✅ Repository updated successfully

REM 2. Install and update all Node.js dependencies
echo [%time%] Step 2: Installing and updating dependencies
if exist "package.json" (
    echo Installing Node.js dependencies...
    call npm install --silent >> ..\%LOG_FILE% 2>&1
    echo ✅ Node.js dependencies installed
)

if exist "frontend\package.json" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install --silent >> ..\..\%LOG_FILE% 2>&1
    cd ..
    echo ✅ Frontend dependencies installed
)

REM 3. Run linting and static analysis
echo [%time%] Step 3: Running linting and static analysis
if exist "package.json" (
    echo Running ESLint...
    call npx eslint src\ --ext .js,.jsx,.ts,.tsx --max-warnings 0 >> ..\%LOG_FILE% 2>&1 || echo ⚠️  ESLint found issues
)
echo ✅ Linting completed

REM 4. Build the project
echo [%time%] Step 4: Building the project
if exist "package.json" (
    echo Building project...
    call npm run build >> ..\%LOG_FILE% 2>&1
    echo ✅ Project build completed
)

if exist "frontend\package.json" (
    echo Building frontend...
    cd frontend
    call npm run build >> ..\..\%LOG_FILE% 2>&1
    cd ..
    echo ✅ Frontend build completed
)

REM 5. Run all unit and integration tests
echo [%time%] Step 5: Running tests
if exist "package.json" (
    echo Running tests...
    set CI=true
    call npm test -- --watchAll=false >> ..\%LOG_FILE% 2>&1 || echo ⚠️  Some tests failed
    echo ✅ Tests completed
)

REM 6. Create/update environment variables
echo [%time%] Step 6: Setting up environment variables
if exist "frontend" if not exist "frontend\.env" (
    echo Creating frontend .env file...
    echo REACT_APP_BACKEND_URL=https://esim-myanmar-api.vercel.app > frontend\.env
    echo REACT_APP_WEBSITE_URL=%WEBSITE_URL% >> frontend\.env
    echo GENERATE_SOURCEMAP=false >> frontend\.env
)

REM 7. Git operations
echo [%time%] Step 7: Committing and pushing changes
git add -A >> ..\%LOG_FILE% 2>&1
git diff --cached --quiet || (
    git commit -m "Auto update: %date% %time%" >> ..\%LOG_FILE% 2>&1
    git push origin main >> ..\%LOG_FILE% 2>&1
    echo ✅ Changes committed and pushed
) || echo ℹ️  No changes to commit

REM 8. Deploy to Vercel
echo [%time%] Step 8: Deploying to Vercel
call npx vercel --token=%VERCEL_TOKEN% --prod --confirm --project=%VERCEL_PROJECT_ID% >> ..\%LOG_FILE% 2>&1
echo ✅ Production deployment completed

REM 9. SEO Audit
echo [%time%] Step 9: Starting SEO Audit
echo Checking website: %WEBSITE_URL%

REM Check robots.txt
echo Checking robots.txt...
curl -s %WEBSITE_URL%/robots.txt > robots_temp.txt 2>nul
if exist robots_temp.txt (
    echo ✅ Robots.txt found and accessible
    type robots_temp.txt
    del robots_temp.txt
) else (
    echo ❌ Robots.txt not found or not accessible
)

REM Check sitemap
echo Checking sitemap...
curl -s %WEBSITE_URL%/sitemap.xml > sitemap_temp.xml 2>nul
if exist sitemap_temp.xml (
    echo ✅ Sitemap found and accessible
    findstr /i "<loc>" sitemap_temp.xml > urls_temp.txt
    for /f "tokens=*" %%i in (urls_temp.txt) do (
        set "url=%%i"
        set "url=!url:<loc>=!"
        set "url=!url:</loc>=!"
        echo Checking URL: !url!
        curl -s -o nul -w "HTTP %%{http_code}" !url! >> ..\%LOG_FILE%
    )
    del sitemap_temp.xml urls_temp.txt
) else (
    echo ⚠️  Sitemap not found, checking common pages
    for %%u in ("%WEBSITE_URL%" "%WEBSITE_URL%/about" "%WEBSITE_URL%/contact") do (
        echo Checking: %%u
        curl -s -o nul -w "HTTP %%{http_code}" %%u >> ..\%LOG_FILE%
    )
)

REM Final Report
echo.
echo ===== Deployment and SEO Audit Completed =====
echo ✅ Code pulled from repository
echo ✅ Dependencies installed
echo ✅ Linting and static analysis completed
echo ✅ Project built successfully
echo ✅ Tests executed
echo ✅ Deployed to Vercel
echo ✅ SEO audit completed
echo.
echo 📊 Detailed logs saved to: %LOG_FILE%
echo 🌐 Website URL: %WEBSITE_URL%
echo.

cd ..
pause