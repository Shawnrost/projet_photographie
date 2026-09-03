"""
Consumer WebSocket pour les notifications temps réel.
Connexion : ws://localhost:8000/ws/notifications/?token=<access_token>
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        utilisateur = self.scope.get("user")
        if not utilisateur or not utilisateur.is_authenticated:
            await self.close(code=4001)
            return

        self.utilisateur    = utilisateur
        self.group_name     = f"notifs_{utilisateur.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    # Reçoit du groupe et envoie au client WebSocket
    async def envoyer_notification(self, event):
        await self.send(text_data=json.dumps({
            "type":         "notification",
            "notification": event["notification"],
        }))