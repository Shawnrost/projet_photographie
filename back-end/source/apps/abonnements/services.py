from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import (
    Abonnement, PlanTarif, SubscriptionStatus, SubscriptionDuree
)
from apps.users.models import ProfilPhotographe


DUREE_EN_JOURS = {
    SubscriptionDuree.UN_MOIS:    30,
    SubscriptionDuree.TROIS_MOIS: 90,
    SubscriptionDuree.SIX_MOIS:  180,
}


class AbonnementService:

    @staticmethod
    def get_tarifs():
        """Retourne tous les tarifs actifs depuis la base de données."""
        return PlanTarif.objects.filter(est_actif=True)

    @staticmethod
    def get_plan_tarif(plan: str, duree: str) -> PlanTarif:
        """
        Récupère le PlanTarif correspondant.
        Lève ValueError si introuvable ou inactif.
        """
        try:
            return PlanTarif.objects.get(plan=plan, duree=duree, est_actif=True)
        except PlanTarif.DoesNotExist:
            raise ValueError(
                f"Le tarif '{plan} — {duree}' est introuvable ou indisponible."
            )

    @staticmethod
    def souscrire(photographe: ProfilPhotographe, plan: str, duree: str) -> Abonnement:
        """
        Crée un nouvel abonnement pour le photographe.
        - Récupère le prix depuis PlanTarif en base.
        - Annule automatiquement l'abonnement actif existant.
        - Conserve un snapshot du prix au moment de la souscription.
        """
        plan_tarif = AbonnementService.get_plan_tarif(plan, duree)

        # Annuler l'abonnement actif existant
        AbonnementService._annuler_abonnement_actif(photographe)

        nb_jours = DUREE_EN_JOURS[duree]
        date_fin = timezone.now() + timedelta(days=nb_jours)

        abonnement = Abonnement.objects.create(
            photographe=photographe,
            plan_tarif=plan_tarif,
            type=plan,
            duree=duree,
            status=SubscriptionStatus.ACTIVE,
            prix=plan_tarif.prix,   # snapshot du prix actuel
            date_fin=date_fin,
        )
        return abonnement

    @staticmethod
    def annuler(photographe: ProfilPhotographe, abonnement_id: str) -> Abonnement:
        abonnement = get_object_or_404(Abonnement, id=abonnement_id)

        if abonnement.photographe != photographe:
            raise ValueError("Cet abonnement ne vous appartient pas.")

        if abonnement.status != SubscriptionStatus.ACTIVE:
            raise ValueError("Seul un abonnement actif peut être annulé.")

        abonnement.status = SubscriptionStatus.ANNULE
        abonnement.save(update_fields=["status"])
        return abonnement

    @staticmethod
    def verifier_statut(photographe: ProfilPhotographe) -> dict:
        try:
            abonnement = Abonnement.objects.filter(
                photographe=photographe,
                status=SubscriptionStatus.ACTIVE
            ).latest("date_fin")
        except Abonnement.DoesNotExist:
            return {"a_abonnement_actif": False, "abonnement": None}

        abonnement.synchroniser_statut()
        abonnement.refresh_from_db()

        return {
            "a_abonnement_actif": abonnement.est_actif,
            "abonnement": abonnement if abonnement.est_actif else None,
        }

    @staticmethod
    def historique(photographe: ProfilPhotographe):
        return Abonnement.objects.filter(photographe=photographe)

    @staticmethod
    def _annuler_abonnement_actif(photographe: ProfilPhotographe) -> None:
        Abonnement.objects.filter(
            photographe=photographe,
            status=SubscriptionStatus.ACTIVE
        ).update(status=SubscriptionStatus.ANNULE)