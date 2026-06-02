#!/bin/bash
# CoffeeFriend PWA Deployment Checklist

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     CoffeeFriend PWA - Deployment Verification            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        return 1
    fi
}

echo "📋 Checking required files..."
echo ""

REQUIRED_FILES=(
    "pageone.html"
    "pagetwo.html"
    "pagethree.html"
    "pagefour.html"
    "styles.css"
    "script.js"
    "manifest.json"
    "sw.js"
    "install.html"
)

ALL_FOUND=true
for file in "${REQUIRED_FILES[@]}"; do
    if ! check_file "$file"; then
        ALL_FOUND=false
    fi
done

echo ""
echo "📦 File sizes (efficient for mobile):"
echo ""
ls -lh manifest.json sw.js install.html | awk '{print "  " $9 ": " $5}'

echo ""
if [ "$ALL_FOUND" = true ]; then
    echo -e "${GREEN}✓ All files present and ready for deployment!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Upload all files to your web server"
    echo "  2. Ensure HTTPS is enabled"
    echo "  3. Share this URL with users:"
    echo "     https://yourdomain.com/coffeeapp/install.html"
    echo ""
    echo "✨ Users can now:"
    echo "  • Install the app on their mobile device"
    echo "  • Use it offline without internet"
    echo "  • Launch it from their home screen"
else
    echo -e "${RED}✗ Some files are missing. Check above.${NC}"
fi

echo ""
echo "📱 Installation methods:"
echo "  iOS:     Browser → Share → Add to Home Screen"
echo "  Android: Browser → Menu → Install app"
echo ""
echo "For more info, see: PWA_README.md or MOBILE_SETUP.md"
echo ""
