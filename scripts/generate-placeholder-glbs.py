#!/usr/bin/env python3
"""
Generate simple placeholder GLB files for testing
These are minimal valid GLB files with basic geometry
"""

import struct
import json
import base64

def create_simple_glb(vertices, indices, output_file):
    """Create a minimal GLB file with given vertices and indices"""

    # Convert vertices and indices to binary
    vertex_data = struct.pack(f'{len(vertices)}f', *vertices)
    index_data = struct.pack(f'{len(indices)}H', *indices)

    # Create bufferViews
    buffer_length = len(vertex_data) + len(index_data)

    # Minimal glTF JSON
    gltf = {
        "asset": {"version": "2.0"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [{
            "primitives": [{
                "attributes": {"POSITION": 0},
                "indices": 1,
                "mode": 4
            }]
        }],
        "accessors": [
            {
                "bufferView": 0,
                "componentType": 5126,
                "count": len(vertices) // 3,
                "type": "VEC3",
                "max": [max(vertices[i::3]) for i in range(3)],
                "min": [min(vertices[i::3]) for i in range(3)]
            },
            {
                "bufferView": 1,
                "componentType": 5123,
                "count": len(indices),
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {
                "buffer": 0,
                "byteOffset": 0,
                "byteLength": len(vertex_data),
                "target": 34962
            },
            {
                "buffer": 0,
                "byteOffset": len(vertex_data),
                "byteLength": len(index_data),
                "target": 34963
            }
        ],
        "buffers": [{"byteLength": buffer_length}]
    }

    # Convert JSON to bytes
    json_data = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    json_padding = (4 - len(json_data) % 4) % 4
    json_data += b' ' * json_padding

    # Combine binary data
    binary_data = vertex_data + index_data
    binary_padding = (4 - len(binary_data) % 4) % 4
    binary_data += b'\x00' * binary_padding

    # GLB header
    magic = 0x46546C67  # "glTF"
    version = 2
    total_length = 12 + 8 + len(json_data) + 8 + len(binary_data)

    with open(output_file, 'wb') as f:
        # Header
        f.write(struct.pack('<III', magic, version, total_length))
        # JSON chunk
        f.write(struct.pack('<I', len(json_data)))
        f.write(struct.pack('<I', 0x4E4F534A))  # "JSON"
        f.write(json_data)
        # BIN chunk
        f.write(struct.pack('<I', len(binary_data)))
        f.write(struct.pack('<I', 0x004E4942))  # "BIN\0"
        f.write(binary_data)

# Create simple character model (humanoid shape)
def create_character_model(output_file):
    # Simple humanoid vertices (box man)
    vertices = [
        # Head
        -0.2, 1.6, -0.2,  0.2, 1.6, -0.2,  0.2, 2.0, -0.2,  -0.2, 2.0, -0.2,
        -0.2, 1.6, 0.2,   0.2, 1.6, 0.2,   0.2, 2.0, 0.2,   -0.2, 2.0, 0.2,
        # Body
        -0.3, 0.8, -0.2,  0.3, 0.8, -0.2,  0.3, 1.6, -0.2,  -0.3, 1.6, -0.2,
        -0.3, 0.8, 0.2,   0.3, 0.8, 0.2,   0.3, 1.6, 0.2,   -0.3, 1.6, 0.2,
    ]

    indices = [
        # Head faces
        0,1,2, 0,2,3, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 2,3,7, 2,7,6, 0,3,7, 0,7,4, 1,2,6, 1,6,5,
        # Body faces
        8,9,10, 8,10,11, 12,13,14, 12,14,15, 8,9,13, 8,13,12, 10,11,15, 10,15,14, 8,11,15, 8,15,12, 9,10,14, 9,14,13,
    ]

    create_simple_glb(vertices, indices, output_file)

# Create castle/environment model
def create_castle_model(output_file):
    # Simple castle wall
    vertices = [
        # Walls
        -5, 0, -5,  5, 0, -5,  5, 4, -5,  -5, 4, -5,
        -5, 0, 5,   5, 0, 5,   5, 4, 5,   -5, 4, 5,
    ]

    indices = [
        0,1,2, 0,2,3, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 2,3,7, 2,7,6, 0,3,7, 0,7,4, 1,2,6, 1,6,5,
    ]

    create_simple_glb(vertices, indices, output_file)

# Create book model
def create_book_model(output_file):
    # Simple book shape
    vertices = [
        -0.15, 0, -0.2,  0.15, 0, -0.2,  0.15, 0.25, -0.2,  -0.15, 0.25, -0.2,
        -0.15, 0, 0.2,   0.15, 0, 0.2,   0.15, 0.25, 0.2,   -0.15, 0.25, 0.2,
    ]

    indices = [
        0,1,2, 0,2,3, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 2,3,7, 2,7,6, 0,3,7, 0,7,4, 1,2,6, 1,6,5,
    ]

    create_simple_glb(vertices, indices, output_file)

# Generate all models
import os
os.makedirs('public/models', exist_ok=True)

print("Generating placeholder GLB models...")
create_character_model('public/models/dual-wield-assassin.glb')
create_character_model('public/models/futuristic-knight.glb')
create_character_model('public/models/futuristic-armored-wizard.glb')
create_castle_model('public/models/castle-interior.glb')
create_book_model('public/models/enchanted-book.glb')
print("✅ All placeholder GLB files created!")
