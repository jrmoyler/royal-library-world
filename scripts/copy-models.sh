#!/bin/bash

# Script to copy GLB model files to the correct location
# Usage: ./scripts/copy-models.sh

set -e

MODELS_DIR="public/models"
SOURCE_DIR="${1:-.}"

echo "🎮 Copying GLB models to $MODELS_DIR..."

# Create models directory if it doesn't exist
mkdir -p "$MODELS_DIR"

# Function to copy and rename file
copy_model() {
    local source="$1"
    local target="$2"

    if [ -f "$source" ]; then
        cp "$source" "$MODELS_DIR/$target"
        echo "✅ Copied: $source → $MODELS_DIR/$target"
    else
        echo "⚠️  Not found: $source"
    fi
}

# Copy castle model
copy_model "$SOURCE_DIR/castle interior 3d model.glb" "castle-interior.glb"
copy_model "$SOURCE_DIR/castle-interior.glb" "castle-interior.glb"

# Copy character models
copy_model "$SOURCE_DIR/dual-wield assassin 3d model.glb" "dual-wield-assassin.glb"
copy_model "$SOURCE_DIR/dual-wield-assassin.glb" "dual-wield-assassin.glb"

copy_model "$SOURCE_DIR/futuristic knight 3d model.glb" "futuristic-knight.glb"
copy_model "$SOURCE_DIR/futuristic-knight.glb" "futuristic-knight.glb"

copy_model "$SOURCE_DIR/futuristic armored wizard 3d model.glb" "futuristic-armored-wizard.glb"
copy_model "$SOURCE_DIR/futuristic-armored-wizard.glb" "futuristic-armored-wizard.glb"

# Copy book model
copy_model "$SOURCE_DIR/enchanted book 3d model.glb" "enchanted-book.glb"
copy_model "$SOURCE_DIR/enchanted-book.glb" "enchanted-book.glb"

echo ""
echo "📊 Current models in $MODELS_DIR:"
ls -lh "$MODELS_DIR"/*.glb 2>/dev/null || echo "No GLB files found yet"

echo ""
echo "✨ Done! If models are missing, place them in the project root and run again."
echo "   Or specify source directory: ./scripts/copy-models.sh /path/to/models"
