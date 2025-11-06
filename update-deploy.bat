@echo off
REM Script de mise à jour et déploiement automatisé (Windows)
REM Pour la Calculatrice TI-83 Plus sur www.lhusser.fr/calculatrice/

echo.
echo ===============================================================
echo   Mise a jour Calculatrice TI-83 Plus
echo ===============================================================
echo.

REM Vérifier qu'on est dans le bon répertoire
if not exist "calculatrice-ti83-react\package.json" (
    echo ERREUR: Executez ce script depuis le dossier racine du projet
    pause
    exit /b 1
)

echo Etape 1/5 : Recuperation des dernieres modifications...
git pull origin main
if errorlevel 1 (
    echo AVERTISSEMENT: Impossible de recuperer les mises a jour
    echo Continuez avec la version locale actuelle ? (O/N)
    set /p response=
    if /i not "%response%"=="O" exit /b 1
)

echo.
echo Etape 2/5 : Installation des dependances...
cd calculatrice-ti83-react
call npm install
if errorlevel 1 (
    echo ERREUR: Probleme lors de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo Etape 3/5 : Build de l'application...
call npm run build
if errorlevel 1 (
    echo ERREUR: Probleme lors du build
    pause
    exit /b 1
)

echo Build reussi!

echo.
echo Etape 4/5 : Creation de l'archive de deploiement...
cd ..

REM Créer l'archive ZIP (nécessite PowerShell)
powershell -Command "Compress-Archive -Path 'calculatrice-ti83-react\dist\*' -DestinationPath 'calculatrice-ti83-deploy.zip' -Force"
echo Archive ZIP creee: calculatrice-ti83-deploy.zip

echo.
echo Etape 5/5 : Informations de build...
dir calculatrice-ti83-react\dist
dir calculatrice-ti83-deploy.zip

echo.
echo ===============================================================
echo   Mise a jour terminee avec succes!
echo ===============================================================
echo.
echo PROCHAINE ETAPE : Deploiement sur le serveur
echo.
echo Option 1 : Via FTP (FileZilla, WinSCP, etc.)
echo   1. Connectez-vous a votre serveur
echo   2. Allez dans /public_html/calculatrice/
echo   3. Supprimez l'ancien contenu
echo   4. Uploadez le contenu de calculatrice-ti83-react\dist\
echo.
echo Option 2 : Uploadez l'archive
echo   1. Uploadez calculatrice-ti83-deploy.zip sur votre serveur
echo   2. Extrayez-la dans /public_html/calculatrice/
echo.
echo URL de deploiement: https://www.lhusser.fr/calculatrice/
echo.

pause
