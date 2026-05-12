from django.db import models
import uuid
from apps.users.models import Utilisateur

# Create your models here.

class AdminLog(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    admin = models.ForeignKey(
        Utilisateur,
        on_delete=models.RESTRICT
    )

    action = models.CharField(max_length=100)

    target_type = models.CharField(max_length=50)

    target_id = models.UUIDField()

    created_at = models.DateTimeField(auto_now_add=True)