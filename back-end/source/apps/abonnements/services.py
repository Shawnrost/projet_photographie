from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import (
    Abonnement, PlanTarif, SubscriptionStatus, SubscriptionDuree, SubscriptionPlan, Suivi
)
from apps.users.models import ProfilPhotographe, Utilisateur
from apps.publications.models import Publication


DUREE_EN_JOURS = {
    SubscriptionDuree.UN_MOIS:    30,
    SubscriptionDuree.TROIS_MOIS: 90,
    SubscriptionDuree.SIX_MOIS:  180,
}


class AbonnementService:

    @staticmethod
    def get_tarifs():
        return PlanTarif.objects.filter(est_actif=True)

    @staticmethod
    def get_plan_tarif(plan: str, duree: str) -> PlanTarif:
        try:
            return PlanTarif.objects.get(plan=plan, duree=duree, est_actif=True)
        except PlanTarif.DoesNotExist:
            raise ValueError(f"Le tarif '{plan} — {duree}' est introuvable ou indisponible.")

    @staticmethod
    def souscrire(photographe: ProfilPhotographe, plan: str, duree: str) -> Abonnement:
        plan_tarif = AbonnementService.get_plan_tarif(plan, duree)
        AbonnementService._annuler_abonnement_actif(photographe)
        nb_jours = DUREE_EN_JOURS[duree]
        date_fin = timezone.now() + timedelta(days=nb_jours)
        return Abonnement.objects.create(
            photographe=photographe,
            plan_tarif=plan_tarif,
            type=plan,
            duree=duree,
            status=SubscriptionStatus.ACTIVE,
            prix=plan_tarif.prix,
            date_fin=date_fin,
        )

    @staticmethod
    def creer_essai_gratuit(photographe: ProfilPhotographe) -> Abonnement:
        """
        Crée un abonnement Premium gratuit d'1 mois à l'inscription.
        - Prix = 0.00, plan_tarif = None.
        - Utilisable une seule fois — vérifié via essai_utilise sur ProfilPhotographe.
        """
        if photographe.essai_utilise:
            raise ValueError("Vous avez déjà utilisé votre essai gratuit.")

        date_fin = timezone.now() + timedelta(days=30)

        abonnement = Abonnement.objects.create(
            photographe=photographe,
            plan_tarif=None,
            type=SubscriptionPlan.PREMIUM,
            duree=SubscriptionDuree.UN_MOIS,
            status=SubscriptionStatus.ACTIVE,
            prix=0.00,
            date_fin=date_fin,
        )

        photographe.essai_utilise = True
        photographe.save(update_fields=["essai_utilise"])

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


class SuiviService:
 
    @staticmethod
    def toggler_suivi(suiveur: Utilisateur, suivi_id: str) -> dict:
        """
        Follow / Unfollow toggle.
        Retourne {"suivi": True/False, "nombre_abonnes": int}
        """
        from apps.users.models import Utilisateur
        from django.shortcuts import get_object_or_404
 
        suivi = get_object_or_404(Utilisateur, id=suivi_id)
 
        if suiveur == suivi:
            raise ValueError("Vous ne pouvez pas vous suivre vous-même.")
 
        relation, cree = Suivi.objects.get_or_create(
            suiveur=suiveur,
            suivi=suivi
        )
        if not cree:
            relation.delete()
            est_suivi = False
        else:
            est_suivi = True
 
        return {
            "suivi":           est_suivi,
            "nombre_abonnes":  suivi.abonnes.count(),
        }
 
    @staticmethod
    def get_abonnes(utilisateur: Utilisateur):
        """Retourne les utilisateurs qui suivent cet utilisateur."""
        return Utilisateur.objects.filter(
            suivis__suivi=utilisateur
        ).order_by("-suivis__created_at")
 
    @staticmethod
    def get_suivis(utilisateur: Utilisateur):
        """Retourne les utilisateurs que cet utilisateur suit."""
        return Utilisateur.objects.filter(
            abonnes__suiveur=utilisateur
        ).order_by("-abonnes__created_at")
 
    @staticmethod
    def est_suivi_par(suiveur: Utilisateur, suivi: Utilisateur) -> bool:
        """Vérifie si suiveur suit suivi."""
        return Suivi.objects.filter(suiveur=suiveur, suivi=suivi).exists()
 
    @staticmethod
    def fil_actualite(utilisateur: Utilisateur):
        """
        Retourne les publications des photographes suivis par l'utilisateur,
        triées par date de publication décroissante.
        """
        # Récupérer les IDs des utilisateurs suivis
        suivis_ids = Suivi.objects.filter(
            suiveur=utilisateur
        ).values_list("suivi_id", flat=True)
 
        return Publication.objects.filter(
            is_active=True,
            photographe__utilisateur_id__in=suivis_ids
        ).select_related(
            "photographe__utilisateur"
        ).prefetch_related(
            "categories", "tags", "reactions"
        ).order_by("-created_at")
