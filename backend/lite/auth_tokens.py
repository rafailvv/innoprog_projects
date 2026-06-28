from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl


class AuthTokenError(ValueError):
    pass


def _urlsafe_b64decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def parse_platform_auth_token(token: str, secret: str) -> int:
    if not token or not secret:
        raise AuthTokenError("Missing platform auth token")

    try:
        version, payload_encoded, signature_encoded = token.split(".", 2)
    except ValueError as exc:
        raise AuthTokenError("Invalid platform auth token") from exc

    if version != "v1":
        raise AuthTokenError("Invalid platform auth token")

    expected_signature = hmac.new(
        secret.encode("utf-8"),
        payload_encoded.encode("utf-8"),
        hashlib.sha256,
    ).digest()

    try:
        actual_signature = _urlsafe_b64decode(signature_encoded)
    except Exception as exc:
        raise AuthTokenError("Invalid platform auth token") from exc

    if not hmac.compare_digest(expected_signature, actual_signature):
        raise AuthTokenError("Invalid platform auth token")

    try:
        payload = json.loads(_urlsafe_b64decode(payload_encoded).decode("utf-8"))
    except Exception as exc:
        raise AuthTokenError("Invalid platform auth token") from exc

    client_id = payload.get("client_id")
    if not isinstance(client_id, int):
        raise AuthTokenError("Invalid platform auth token")
    return client_id


def verify_telegram_init_data(
    init_data: str,
    bot_token: str,
    *,
    max_age_seconds: int = 86400,
    now: int | None = None,
) -> int:
    if not init_data or not bot_token:
        raise AuthTokenError("Missing Telegram init data")

    pairs = parse_qsl(init_data, keep_blank_values=True, strict_parsing=False)
    values = dict(pairs)
    received_hash = values.pop("hash", "")
    if not received_hash:
        raise AuthTokenError("Missing Telegram init data hash")

    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted(values.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode("utf-8"), hashlib.sha256).digest()
    expected_hash = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_hash, received_hash):
        raise AuthTokenError("Invalid Telegram init data hash")

    if max_age_seconds > 0:
        try:
            auth_date = int(values.get("auth_date", "0"))
        except ValueError as exc:
            raise AuthTokenError("Invalid Telegram init data auth_date") from exc
        current_time = int(time.time()) if now is None else int(now)
        if auth_date <= 0 or current_time - auth_date > max_age_seconds:
            raise AuthTokenError("Expired Telegram init data")

    try:
        user = json.loads(values["user"])
        telegram_id = user["id"]
    except Exception as exc:
        raise AuthTokenError("Telegram init data does not contain user id") from exc

    if not isinstance(telegram_id, int):
        raise AuthTokenError("Invalid Telegram user id")
    return telegram_id
