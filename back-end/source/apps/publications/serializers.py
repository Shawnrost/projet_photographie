from rest_framework import serializers
from .models import Publication, Categorie, Tag, Reaction, PublicationType


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Categorie
        fields = ["id", "nom", "description"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Tag
        fields = ["id", "nom"]


# ─────────────────────────────────────────────
# Lecture
# ─────────────────────────────────────────────

class PublicationListSerializer(serializers.ModelSerializer):
    categories     = CategorieSerializer(many=True, read_only=True)
    tags           = TagSerializer(many=True, read_only=True)
    nombre_likes   = serializers.IntegerField(read_only=True)
    photographe_nom   = serializers.SerializerMethodField()
    photographe_photo = serializers.SerializerMethodField()
    a_like         = serializers.SerializerMethodField()
    image_affichee = serializers.SerializerMethodField()

    class Meta:
        model  = Publication
        fields = [
            "id", "titre", "description",
            "image_affichee",   # ← image publique (filigrane ou originale)
            "est_vendue",
            "type", "prix",
            "categories", "tags",
            "nombre_likes", "a_like",
            "photographe_nom", "photographe_photo",
            "is_active", "created_at",
        ]

    def get_image_affichee(self, obj):
        """
        Retourne l'URL de l'image à afficher :
        - image_filigrane si non vendue
        - image_originale si vendue
        """
        request = self.context.get("request")
        image   = obj.image_publique
        if image and request:
            return request.build_absolute_uri(image.url)
        return None

    def get_photographe_nom(self, obj):
        u = obj.photographe.utilisateur
        return f"{u.prenom} {u.nom}"

    def get_photographe_photo(self, obj):
        request = self.context.get("request")
        photo   = obj.photographe.utilisateur.photo_profil
        if photo and request:
            return request.build_absolute_uri(photo.url)
        return None

    def get_a_like(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.reactions.filter(utilisateur=request.user).exists()
        return False


class PublicationDetailSerializer(PublicationListSerializer):
    photographe_id = serializers.UUIDField(source="photographe.id", read_only=True)

    class Meta(PublicationListSerializer.Meta):
        fields = PublicationListSerializer.Meta.fields + ["photographe_id", "updated_at"]


# ─────────────────────────────────────────────
# Création / Modification
# ─────────────────────────────────────────────

class PublicationCreateSerializer(serializers.ModelSerializer):
    categories = serializers.ListField(
        child=serializers.UUIDField(),
        required=False,
        write_only=True
    )
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        write_only=True
    )

    is_active = serializers.BooleanField(required=False, default=True)

    class Meta:
        model  = Publication
        fields = [
            "titre", "description", "image_originale", "type",
            "prix", "categories", "tags", "is_active",
        ]

    def to_internal_value(self, data):
        champs_scalaires = ["titre", "description", "type", "prix"]
        data_normalisee  = data.copy()
        for champ in champs_scalaires:
            if champ in data_normalisee:
                valeur = data_normalisee[champ]
                if isinstance(valeur, list) and len(valeur) == 1:
                    data_normalisee[champ] = valeur[0]

        # Gérer is_active séparément
        # Si non envoyé → retirer du dict pour laisser le default=True du modèle
        # Si envoyé → convertir string en booléen
        if "is_active" in data_normalisee:
            valeur = data_normalisee["is_active"]
            if isinstance(valeur, list) and len(valeur) == 1:
                valeur = valeur[0]
            if isinstance(valeur, str):
                data_normalisee["is_active"] = valeur.lower() not in ("false", "0", "no", "")
        return super().to_internal_value(data_normalisee)

    def validate(self, attrs):
        if attrs.get("type") == PublicationType.VENTE and not attrs.get("prix"):
            raise serializers.ValidationError(
                {"prix": "Le prix est obligatoire pour une publication de type vente."}
            )
        if attrs.get("prix") is not None and attrs["prix"] < 0:
            raise serializers.ValidationError(
                {"prix": "Le prix ne peut pas être négatif."}
            )
        return attrs

    def validate_categories(self, valeurs):
        categories = Categorie.objects.filter(id__in=valeurs)
        if len(categories) != len(valeurs):
            raise serializers.ValidationError(
                "Une ou plusieurs catégories sont invalides."
            )
        return categories

    def validate_tags(self, valeurs):
        return list({tag.strip().lower() for tag in valeurs if tag.strip()})

    def create(self, validated_data):
        categories = validated_data.pop("categories", [])
        noms_tags  = validated_data.pop("tags", [])

        publication = Publication.objects.create(**validated_data)

        if categories:
            publication.categories.set(categories)

        tags = []
        for nom in noms_tags:
            tag, _ = Tag.objects.get_or_create(nom=nom)
            tags.append(tag)
        if tags:
            publication.tags.set(tags)

        return publication

    def update(self, instance, validated_data):
        categories  = validated_data.pop("categories", None)
        noms_tags   = validated_data.pop("tags", None)

        nouvelle_image = validated_data.get("image_originale")
        if nouvelle_image and instance.image_originale:
            instance.image_originale.delete(save=False)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if categories is not None:
            instance.categories.set(categories)

        if noms_tags is not None:
            tags = []
            for nom in noms_tags:
                tag, _ = Tag.objects.get_or_create(nom=nom)
                tags.append(tag)
            instance.tags.set(tags)

        return instance


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Reaction
        fields = ["id", "utilisateur", "publication", "created_at"]
        read_only_fields = ["id", "utilisateur", "created_at"]