#!/usr/bin/env python3
"""
Create better procedural GLB models
More detailed geometry than simple boxes
"""

import struct
import json
import math

def create_glb(vertices, normals, indices, output_file):
    """Create a GLB file with vertices, normals, and indices"""

    # Pack data
    vertex_data = struct.pack(f'{len(vertices)}f', *vertices)
    normal_data = struct.pack(f'{len(normals)}f', *normals)
    index_data = struct.pack(f'{len(indices)}H', *indices)

    buffer_length = len(vertex_data) + len(normal_data) + len(index_data)

    # glTF JSON
    gltf = {
        "asset": {"version": "2.0"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "materials": [{
            "pbrMetallicRoughness": {
                "baseColorFactor": [0.8, 0.8, 0.9, 1.0],
                "metallicFactor": 0.3,
                "roughnessFactor": 0.7
            }
        }],
        "meshes": [{
            "primitives": [{
                "attributes": {
                    "POSITION": 0,
                    "NORMAL": 1
                },
                "indices": 2,
                "mode": 4,
                "material": 0
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
                "componentType": 5126,
                "count": len(normals) // 3,
                "type": "VEC3"
            },
            {
                "bufferView": 2,
                "componentType": 5123,
                "count": len(indices),
                "type": "SCALAR"
            }
        ],
        "bufferViews": [
            {"buffer": 0, "byteOffset": 0, "byteLength": len(vertex_data), "target": 34962},
            {"buffer": 0, "byteOffset": len(vertex_data), "byteLength": len(normal_data), "target": 34962},
            {"buffer": 0, "byteOffset": len(vertex_data) + len(normal_data), "byteLength": len(index_data), "target": 34963}
        ],
        "buffers": [{"byteLength": buffer_length}]
    }

    json_data = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    json_padding = (4 - len(json_data) % 4) % 4
    json_data += b' ' * json_padding

    binary_data = vertex_data + normal_data + index_data
    binary_padding = (4 - len(binary_data) % 4) % 4
    binary_data += b'\x00' * binary_padding

    total_length = 12 + 8 + len(json_data) + 8 + len(binary_data)

    with open(output_file, 'wb') as f:
        f.write(struct.pack('<III', 0x46546C67, 2, total_length))
        f.write(struct.pack('<I', len(json_data)))
        f.write(struct.pack('<I', 0x4E4F534A))
        f.write(json_data)
        f.write(struct.pack('<I', len(binary_data)))
        f.write(struct.pack('<I', 0x004E4942))
        f.write(binary_data)

def create_humanoid_character(output_file, scale=1.0):
    """Create a detailed humanoid character"""
    vertices = []
    normals = []
    indices = []
    idx_offset = 0

    def add_cylinder(x, y, z, radius, height, segments=8):
        nonlocal idx_offset
        start_idx = len(vertices) // 3

        # Add vertices for cylinder
        for i in range(segments):
            angle = 2 * math.pi * i / segments
            cx = x + radius * math.cos(angle)
            cz = z + radius * math.sin(angle)

            # Bottom
            vertices.extend([cx, y, cz])
            normals.extend([math.cos(angle), 0, math.sin(angle)])

            # Top
            vertices.extend([cx, y + height, cz])
            normals.extend([math.cos(angle), 0, math.sin(angle)])

        # Add faces
        for i in range(segments):
            next_i = (i + 1) % segments
            base = start_idx

            # Side face (2 triangles)
            indices.extend([
                base + i * 2, base + next_i * 2, base + i * 2 + 1,
                base + next_i * 2, base + next_i * 2 + 1, base + i * 2 + 1
            ])

    # Head (cylinder)
    add_cylinder(0, 1.6, 0, 0.2, 0.4, 12)

    # Torso (cylinder)
    add_cylinder(0, 0.8, 0, 0.25, 0.8, 12)

    # Arms
    add_cylinder(-0.4, 1.2, 0, 0.08, 0.6, 8)
    add_cylinder(0.4, 1.2, 0, 0.08, 0.6, 8)

    # Legs
    add_cylinder(-0.12, 0, 0, 0.1, 0.8, 8)
    add_cylinder(0.12, 0, 0, 0.1, 0.8, 8)

    create_glb(vertices, normals, indices, output_file)

def create_castle_environment(output_file):
    """Create a castle wall section"""
    vertices = []
    normals = []
    indices = []

    # Create walls with battlements
    wall_segments = 20
    wall_height = 4
    wall_width = 10

    for i in range(wall_segments):
        x = -wall_width/2 + (wall_width / wall_segments) * i

        # Main wall
        vertices.extend([
            x, 0, 0,
            x + wall_width/wall_segments, 0, 0,
            x, wall_height, 0,
            x + wall_width/wall_segments, wall_height, 0
        ])

        for _ in range(4):
            normals.extend([0, 0, 1])

        base = len(vertices) // 3 - 4
        indices.extend([base, base+1, base+2, base+1, base+3, base+2])

        # Battlements (every other segment)
        if i % 2 == 0:
            vertices.extend([
                x, wall_height, 0,
                x + wall_width/wall_segments/2, wall_height, 0,
                x, wall_height + 0.3, 0,
                x + wall_width/wall_segments/2, wall_height + 0.3, 0
            ])

            for _ in range(4):
                normals.extend([0, 0, 1])

            base = len(vertices) // 3 - 4
            indices.extend([base, base+1, base+2, base+1, base+3, base+2])

    create_glb(vertices, normals, indices, output_file)

def create_book(output_file):
    """Create a detailed book model"""
    vertices = [
        # Front cover
        -0.15, 0, 0.02, 0.15, 0, 0.02, 0.15, 0.25, 0.02, -0.15, 0.25, 0.02,
        # Back cover
        -0.15, 0, -0.02, 0.15, 0, -0.02, 0.15, 0.25, -0.02, -0.15, 0.25, -0.02,
        # Pages (slightly smaller)
        -0.14, 0.01, 0.015, 0.14, 0.01, 0.015, 0.14, 0.24, 0.015, -0.14, 0.24, 0.015,
    ]

    normals = [0,0,1]*4 + [0,0,-1]*4 + [0,0,1]*4

    indices = [
        # Front
        0,1,2, 0,2,3,
        # Back
        4,5,6, 4,6,7,
        # Pages
        8,9,10, 8,10,11,
        # Spine
        0,4,7, 0,7,3,
        # Top
        2,3,7, 2,7,6,
        # Bottom
        0,1,5, 0,5,4,
        # Right edge
        1,2,6, 1,6,5
    ]

    create_glb(vertices, normals, indices, output_file)

# Generate improved models
import os
os.makedirs('public/models', exist_ok=True)

print("Creating improved GLB models...")
create_humanoid_character('public/models/dual-wield-assassin.glb')
create_humanoid_character('public/models/futuristic-knight.glb')
create_humanoid_character('public/models/futuristic-armored-wizard.glb')
create_castle_environment('public/models/castle-interior.glb')
create_book('public/models/enchanted-book.glb')
print("✅ Improved models created!")
print("\n🔄 These are BETTER placeholders.")
print("📁 Upload your actual GLB files to replace them!")
print("📝 See UPLOAD_YOUR_MODELS.md for instructions")
