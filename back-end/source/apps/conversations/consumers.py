"""
Consumer WebSocket pour la messagerie en temps réel.
Fichier : apps/conversations/consumers.py

Protocole :
  - Connexion : ws://localhost:8000/ws/conversations/<conversation_id>/
  - Auth      : token JWT passé en query string : ?token=<access_token>
  - Messages entrants (client → serveur) :
      { "type": "message", "contenu": "Bonjour !" }
  - Messages sortants (serveur → client) :
      { "type": "message", "message": { ...MessageSerializer } }
      { "type": "erreur",  "message": "..." }
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist


class ConversationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"conversation_{self.conversation_id}"

        # Vérifier l'authentification
        utilisateur = self.scope.get("user")
        if not utilisateur or not utilisateur.is_authenticated:
            await self.close(code=4001)
            return

        # Vérifier que l'utilisateur fait partie de la conversation
        if not await self._est_participant(utilisateur, self.conversation_id):
            await self.close(code=4003)
            return

        self.utilisateur = utilisateur

        # Rejoindre le groupe de la conversation
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Reçoit un message texte du client WebSocket."""
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(json.dumps({
                "type": "erreur",
                "message": "Format JSON invalide."
            }))
            return

        if data.get("type") == "message":
            contenu = data.get("contenu", "").strip()
            if not contenu:
                await self.send(json.dumps({
                    "type": "erreur",
                    "message": "Le message ne peut pas être vide."
                }))
                return

            # Sauvegarder le message en base
            message = await self._sauvegarder_message(contenu)
            if message is None:
                await self.send(json.dumps({
                    "type": "erreur",
                    "message": "Impossible d'envoyer le message."
                }))
                return

            # Diffuser à tous les participants de la conversation
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type":    "diffuser_message",
                    "message": message,
                }
            )

    async def diffuser_message(self, event):
        """Reçoit du groupe et envoie au WebSocket client."""
        await self.send(text_data=json.dumps({
            "type":    "message",
            "message": event["message"],
        }))

    # ── Helpers DB (sync → async) ─────────────────────────────────────────

    @database_sync_to_async
    def _est_participant(self, utilisateur, conversation_id) -> bool:
        from apps.conversations.models import Conversation
        from django.db.models import Q
        return Conversation.objects.filter(
            Q(client=utilisateur) | Q(photographe__utilisateur=utilisateur),
            id=conversation_id
        ).exists()

    @database_sync_to_async
    def _sauvegarder_message(self, contenu: str) -> dict | None:
        from apps.conversations.models import Conversation
        from apps.conversations.services import MessageService
        from apps.conversations.serializers import MessageSerializer
        try:
            conversation = Conversation.objects.get(id=self.conversation_id)
            message      = MessageService.envoyer_message(
                conversation=conversation,
                expediteur=self.utilisateur,
                contenu=contenu,
            )
            # Retourner un dict sérialisable (pas d'objet Django)
            return {
                "id":          str(message.id),
                "contenu":     message.contenu,
                "expediteur":  {
                    "id":     str(message.expediteur.id),
                    "nom":    message.expediteur.nom,
                    "prenom": message.expediteur.prenom,
                },
                "is_read":     message.is_read,
                "sent_at":     message.sent_at.isoformat(),
                "fichier_url": None,
            }
        except ObjectDoesNotExist:
            return None