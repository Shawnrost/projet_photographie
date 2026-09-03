"""
Signaux Django qui déclenchent les notifications automatiquement.
Fichier : apps/notifications/signals.py
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver


@receiver(post_save, sender="publications.Reaction")
def on_like_publication(sender, instance, created, **kwargs):
    """Déclenché quand un utilisateur like une publication."""
    if not created:
        return
    from apps.notifications.services import NotificationService
    NotificationService.notifier_like_publication(
        declencheur=instance.utilisateur,
        publication=instance.publication,
    )


@receiver(post_save, sender="publications.ReactionCommentaire")
def on_like_commentaire(sender, instance, created, **kwargs):
    """Déclenché quand un utilisateur like un commentaire."""
    if not created:
        return
    from apps.notifications.services import NotificationService
    NotificationService.notifier_like_commentaire(
        declencheur=instance.utilisateur,
        commentaire=instance.commentaire,
    )


@receiver(post_save, sender="abonnements.Suivi")
def on_nouveau_suivi(sender, instance, created, **kwargs):
    """Déclenché quand un utilisateur en suit un autre."""
    if not created:
        return
    from apps.notifications.services import NotificationService
    NotificationService.notifier_nouveau_suivi(
        declencheur=instance.suiveur,
        suivi=instance.suivi,
    )


@receiver(post_save, sender="publications.Commentaire")
def on_reponse_commentaire(sender, instance, created, **kwargs):
    """Déclenché quand un utilisateur répond à un commentaire."""
    if not created:
        return
    # Uniquement si c'est une réponse (a un parent)
    if instance.parent is None:
        return
    from apps.notifications.services import NotificationService
    NotificationService.notifier_reponse_commentaire(
        declencheur=instance.auteur,
        commentaire=instance,
    )