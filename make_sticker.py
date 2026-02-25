import os
from rembg import remove
from PIL import Image
import io

out_path = r"src\assets\cta-person-sticker.png"
source_path = r"src\assets\hero-student.png"

print(f"Opening source: {source_path}")
with open(source_path, "rb") as f:
    img_data = f.read()

print(f"Source size: {len(img_data)} bytes")
print("Removing background (AI model)...")
output_data = remove(img_data)

img = Image.open(io.BytesIO(output_data)).convert("RGBA")

# Crop tight around the person
bbox = img.getbbox()
if bbox:
    # Add a tiny bit of padding at bottom so feet don't get clipped
    bottom_pad = 5
    bbox = (bbox[0], bbox[1], bbox[2], min(img.height, bbox[3] + bottom_pad))
    img = img.crop(bbox)

print(f"Cropped size: {img.size}")

# Scale to 480px tall for a nice big sticker
target_height = 500
ratio = target_height / img.height
new_w = int(img.width * ratio)
img = img.resize((new_w, target_height), Image.LANCZOS)

img.save(out_path, "PNG")
print(f"Saved sticker -> {out_path} ({new_w}x{target_height})")
