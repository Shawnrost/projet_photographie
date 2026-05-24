"""
Middleware JWT pour Django Channels.
Fichier : apps/conversations/middleware.py

Authentifie l'utilisateur via le token JWT passé en query string :
  ws://localhost:8000/ws/conversations/<id>/?token=<access_token>
"""
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from urllib.parse import parse_qs


@database_sync_to_async
def get_user_from_token(token: str):
    """Décoder le JWT et retourner l'utilisateur correspondant."""
    from rest_framework_simplejwt.tokens import AccessToken
    from rest_framework_simplejwt.exceptions import TokenError
    from apps.users.models import Utilisateur
    try:
        access_token = AccessToken(token)
        user_id      = access_token["user_id"]
        return Utilisateur.objects.get(id=user_id)
    except (TokenError, Utilisateur.DoesNotExist, KeyError):
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    """
    Middleware qui extrait le token JWT du query string
    et l'attache à scope["user"].
    """
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params       = parse_qs(query_string)
        token_list   = params.get("token", [None])
        token        = token_list[0] if token_list else None

        if token:
            scope["user"] = await get_user_from_token(token)
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)