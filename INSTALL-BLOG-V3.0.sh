#!/bin/bash

###############################################################################
# Script de Déploiement Automatique sur Blog
# Calculatrice TI-83 Plus - Version 3.0.0.0
# Programmation TI-BASIC Complète
###############################################################################

set -e  # Arrêter en cas d'erreur

# Configuration - À PERSONNALISER
BLOG_USER="votre-utilisateur"
BLOG_HOST="www.lhusser.fr"
BLOG_PATH="/var/www/html/calculatrice"
VERSION="3.0.0.0"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fichiers
ARCHIVE_TAR="calculatrice-ti83-blog-v${VERSION}.tar.gz"
ARCHIVE_ZIP="calculatrice-ti83-blog-v${VERSION}.zip"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Calculatrice TI-83 Plus - Déploiement sur Blog           ║"
echo "║  Version 3.0.0.0 - Programmation TI-BASIC Complète        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Vérification de l'archive
echo -e "${YELLOW}🔍 Vérification des fichiers...${NC}"
if [ ! -f "$ARCHIVE_TAR" ]; then
    echo -e "${RED}❌ Erreur: Archive $ARCHIVE_TAR introuvable${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archive trouvée: $ARCHIVE_TAR${NC}"
ls -lh "$ARCHIVE_TAR"

# Confirmation
echo ""
echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   • Utilisateur: $BLOG_USER"
echo "   • Serveur: $BLOG_HOST"
echo "   • Chemin: $BLOG_PATH"
echo "   • Version: $VERSION"
echo ""
read -p "Continuer le déploiement? (o/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Oo]$ ]]; then
    echo -e "${RED}❌ Déploiement annulé${NC}"
    exit 1
fi

# Upload de l'archive
echo ""
echo -e "${BLUE}📤 Upload de l'archive sur le serveur...${NC}"
scp "$ARCHIVE_TAR" "${BLOG_USER}@${BLOG_HOST}:/tmp/" || {
    echo -e "${RED}❌ Erreur lors de l'upload${NC}"
    exit 1
}
echo -e "${GREEN}✅ Archive uploadée${NC}"

# Déploiement sur le serveur
echo ""
echo -e "${BLUE}🚀 Déploiement sur le serveur...${NC}"
ssh "${BLOG_USER}@${BLOG_HOST}" << ENDSSH
    set -e

    echo "📁 Préparation du répertoire..."

    # Sauvegarde de l'ancienne version si elle existe
    if [ -d "${BLOG_PATH}" ]; then
        BACKUP_DIR="${BLOG_PATH}-backup-\$(date +%Y%m%d-%H%M%S)"
        echo "💾 Sauvegarde de l'ancienne version: \$BACKUP_DIR"
        mv "${BLOG_PATH}" "\$BACKUP_DIR"
    fi

    # Création du répertoire
    mkdir -p "${BLOG_PATH}"

    # Extraction
    echo "📦 Extraction de l'archive..."
    tar -xzf /tmp/${ARCHIVE_TAR} -C "${BLOG_PATH}/"

    # Permissions
    echo "🔒 Configuration des permissions..."
    chmod -R 755 "${BLOG_PATH}"

    # Nettoyage
    echo "🧹 Nettoyage..."
    rm /tmp/${ARCHIVE_TAR}

    echo "✅ Déploiement terminé avec succès!"
    echo ""
    echo "📊 Contenu du répertoire:"
    ls -lh "${BLOG_PATH}" | head -20
ENDSSH

# Vérification
echo ""
echo -e "${BLUE}🔍 Vérification du déploiement...${NC}"
ssh "${BLOG_USER}@${BLOG_HOST}" << ENDSSH
    if [ -f "${BLOG_PATH}/index.html" ]; then
        echo "✅ index.html présent"
    else
        echo "❌ index.html manquant!"
        exit 1
    fi

    if [ -d "${BLOG_PATH}/assets" ]; then
        echo "✅ Dossier assets présent"
    else
        echo "❌ Dossier assets manquant!"
        exit 1
    fi
ENDSSH

# Succès
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ Déploiement Réussi! 🎉                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}🌐 URL de votre calculatrice:${NC}"
echo -e "   ${GREEN}https://${BLOG_HOST}/calculatrice/${NC}"
echo ""
echo -e "${BLUE}📚 Nouvelles fonctionnalités v3.0:${NC}"
echo "   • Programmation TI-BASIC complète"
echo "   • Menu PRGM (NEW/EDIT/EXEC)"
echo "   • 38+ commandes implémentées"
echo "   • Structures de contrôle (If, For, While, Repeat)"
echo "   • Sous-programmes (prgm/Return)"
echo "   • Menus interactifs"
echo "   • Variables globales"
echo "   • 17 programmes exemples"
echo ""
echo -e "${YELLOW}🧪 Tests recommandés:${NC}"
echo "   1. Ouvrir https://${BLOG_HOST}/calculatrice/"
echo "   2. Appuyer sur PRGM"
echo "   3. Créer un programme test"
echo "   4. L'exécuter"
echo ""
echo -e "${BLUE}📖 Documentation:${NC}"
echo "   • PRGM_USER_GUIDE.md : Guide utilisateur complet"
echo "   • EXAMPLES_PROGRAMS.md : 17 programmes exemples"
echo "   • V3.0_COMPLETION_SUMMARY.md : Résumé technique"
echo ""
echo -e "${GREEN}🎓 Bonne utilisation de la calculatrice TI-BASIC!${NC}"
