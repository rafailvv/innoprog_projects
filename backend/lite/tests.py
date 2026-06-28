import base64
import hashlib
import hmac
import json
from urllib.parse import urlencode

from django.test import SimpleTestCase

from .auth_tokens import AuthTokenError, parse_platform_auth_token, verify_telegram_init_data


def _urlsafe_b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _build_platform_auth_token(client_id: int, secret: str = "bot-token") -> str:
    payload_json = json.dumps(
        {"v": 1, "client_id": int(client_id)},
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
    )
    payload_encoded = _urlsafe_b64encode(payload_json.encode("utf-8"))
    signature = hmac.new(secret.encode("utf-8"), payload_encoded.encode("utf-8"), hashlib.sha256).digest()
    return f"v1.{payload_encoded}.{_urlsafe_b64encode(signature)}"


def _build_telegram_init_data(telegram_id: int, bot_token: str = "bot-token", auth_date: int = 1_800_000_000) -> str:
    values = {
        "auth_date": str(auth_date),
        "query_id": "AAHdF6IQAAAAAN0XohDhrOrc",
        "user": json.dumps({"id": telegram_id, "first_name": "Test"}, separators=(",", ":"), ensure_ascii=False),
    }
    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted(values.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode("utf-8"), hashlib.sha256).digest()
    values["hash"] = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()
    return urlencode(values)


class LoginTokenValidationTests(SimpleTestCase):
    def test_platform_auth_token_accepts_positive_and_negative_ids(self):
        assert parse_platform_auth_token(_build_platform_auth_token(429272623), "bot-token") == 429272623
        assert parse_platform_auth_token(_build_platform_auth_token(-1001234567890), "bot-token") == -1001234567890

    def test_platform_auth_token_rejects_tampered_signature(self):
        token = _build_platform_auth_token(123)
        version, payload, signature = token.split(".", 2)
        with self.assertRaises(AuthTokenError):
            parse_platform_auth_token(f"{version}.{payload}.{signature[::-1]}", "bot-token")

    def test_telegram_init_data_accepts_signed_user_id(self):
        init_data = _build_telegram_init_data(429272623)
        assert verify_telegram_init_data(init_data, "bot-token", now=1_800_000_100) == 429272623

    def test_telegram_init_data_rejects_expired_auth_date(self):
        init_data = _build_telegram_init_data(429272623, auth_date=1_700_000_000)
        with self.assertRaises(AuthTokenError):
            verify_telegram_init_data(init_data, "bot-token", now=1_800_000_100)

    def test_telegram_init_data_rejects_modified_user_id(self):
        init_data = _build_telegram_init_data(429272623)
        tampered = init_data.replace("429272623", "429272624")
        with self.assertRaises(AuthTokenError):
            verify_telegram_init_data(tampered, "bot-token", now=1_800_000_100)
