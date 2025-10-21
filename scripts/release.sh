#!/bin/bash

# Release script for stellar-contract-explorer
# Usage: ./scripts/release.sh [patch|minor|major]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default to patch if no argument provided
RELEASE_TYPE=${1:-patch}

# Validate release type
if [[ ! "$RELEASE_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}Error: Release type must be 'patch', 'minor', or 'major'${NC}"
    echo "Usage: ./scripts/release.sh [patch|minor|major]"
    exit 1
fi

echo -e "${YELLOW}Starting $RELEASE_TYPE release...${NC}"

# Check if working directory is clean
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}Error: Working directory is not clean. Please commit or stash your changes.${NC}"
    exit 1
fi

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${YELLOW}Warning: You're not on the main branch (current: $CURRENT_BRANCH)${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Pull latest changes
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull origin $CURRENT_BRANCH

# Run validation
echo -e "${YELLOW}Running validation...${NC}"
npm run validate

if [ $? -ne 0 ]; then
    echo -e "${RED}Validation failed. Please fix the issues before releasing.${NC}"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}Current version: $CURRENT_VERSION${NC}"

# Bump version and create tag
echo -e "${YELLOW}Bumping version...${NC}"
npm version $RELEASE_TYPE -m "Release v%s"

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: $NEW_VERSION${NC}"

# Push commits and tags
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin $CURRENT_BRANCH --follow-tags

echo -e "${GREEN}✅ Release $NEW_VERSION completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. GitHub Actions will automatically create a release"
echo "2. Check GH release at: https://github.com/theahaco/stellar-contract-explorer/releases"
echo "3. Check NPM release at: https://www.npmjs.com/package/stellar-contract-explorer?activeTab=versions"
