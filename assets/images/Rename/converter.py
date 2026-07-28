import os

# Folder containing the images
folder = r"."

# Supported image extensions
image_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"}

# Get all image files
images = [
    f for f in os.listdir(folder)
    if os.path.isfile(os.path.join(folder, f))
    and os.path.splitext(f)[1].lower() in image_extensions
]

# Sort files alphabetically for consistent numbering
images.sort()

# Rename in two passes to avoid filename conflicts
temp_names = []

# First pass: rename to temporary names
for i, filename in enumerate(images):
    ext = os.path.splitext(filename)[1]
    temp_name = f"__temp__{i}{ext}"
    os.rename(
        os.path.join(folder, filename),
        os.path.join(folder, temp_name)
    )
    temp_names.append(temp_name)

# Second pass: rename to final names
for i, temp_name in enumerate(temp_names, start=83):
    ext = os.path.splitext(temp_name)[1]
    new_name = f"IMG_{i}{'.jpeg'}"
    os.rename(
        os.path.join(folder, temp_name),
        os.path.join(folder, new_name)
    )
    print(f"{temp_name} -> {new_name}")

print("Done!")