"""
Service de filigrane (watermark).
Utilise Pillow pour appliquer un texte en diagonale sur la photo originale.
Fichier à placer dans : apps/publications/watermark.py
"""
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from django.core.files.base import ContentFile
import os


WATERMARK_TEXTE  = "© PixelStudio"   # ← texte du filigrane, à personnaliser
WATERMARK_OPACITE = 80               # 0 = invisible, 255 = opaque


def appliquer_filigrane(image_file) -> ContentFile:
    """
    Prend un fichier image Django (InMemoryUploadedFile ou similaire),
    applique un filigrane en diagonale et retourne un ContentFile prêt
    à être sauvegardé dans un ImageField.
    """
    # Ouvrir l'image originale en RGBA pour supporter la transparence
    img = Image.open(image_file).convert("RGBA")
    largeur, hauteur = img.size

    # Créer un calque transparent de même taille
    calque = Image.new("RGBA", img.size, (255, 255, 255, 0))
    draw   = ImageDraw.Draw(calque)

    # Taille de police proportionnelle à l'image
    taille_police = max(20, largeur // 15)
    try:
        # Essayer une police système plus lisible
        font = ImageFont.truetype("arial.ttf", taille_police)
    except IOError:
        font = ImageFont.load_default()

    # Calculer la taille du texte
    bbox       = draw.textbbox((0, 0), WATERMARK_TEXTE, font=font)
    txt_largeur = bbox[2] - bbox[0]
    txt_hauteur = bbox[3] - bbox[1]

    # Répéter le filigrane en grille diagonale sur toute l'image
    espacement_x = txt_largeur  + 60
    espacement_y = txt_hauteur  + 60

    for x in range(-largeur, largeur * 2, espacement_x):
        for y in range(-hauteur, hauteur * 2, espacement_y):
            # Créer un calque temporaire pour la rotation
            txt_calque = Image.new("RGBA", img.size, (255, 255, 255, 0))
            txt_draw   = ImageDraw.Draw(txt_calque)
            txt_draw.text(
                (x, y),
                WATERMARK_TEXTE,
                font=font,
                fill=(255, 255, 255, WATERMARK_OPACITE)
            )
            # Rotation de 30 degrés
            txt_calque = txt_calque.rotate(30, expand=False)
            calque     = Image.alpha_composite(calque, txt_calque)

    # Fusionner le calque filigrane avec l'image originale
    img_avec_filigrane = Image.alpha_composite(img, calque)

    # Reconvertir en RGB (JPEG ne supporte pas RGBA)
    img_avec_filigrane = img_avec_filigrane.convert("RGB")

    # Sauvegarder dans un buffer mémoire
    buffer = BytesIO()
    img_avec_filigrane.save(buffer, format="JPEG", quality=90)
    buffer.seek(0)

    # Construire le nom du fichier filigrane
    nom_original  = os.path.basename(image_file.name)
    nom_filigrane = f"wm_{nom_original}"
    if not nom_filigrane.lower().endswith((".jpg", ".jpeg")):
        nom_filigrane = os.path.splitext(nom_filigrane)[0] + ".jpg"

    return ContentFile(buffer.read(), name=nom_filigrane)