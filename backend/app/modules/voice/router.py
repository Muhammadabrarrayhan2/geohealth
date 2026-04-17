"""Voice-assisted search endpoint."""
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.modules.voice.service import parse_intent, intent_to_dict

router = APIRouter()


class VoiceParseRequest(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=500)


@router.post("/parse")
def parse_voice_intent(req: VoiceParseRequest):
    """
    Convert a transcribed voice command into structured search filters.

    The frontend captures speech via the Web Speech API, sends the raw
    text here, and applies the returned `specialty`/`emergency` filters
    to the Explore page.

    This endpoint does NOT provide medical advice. It is an accessibility
    helper that maps voice input to the same filters a user could set
    manually.
    """
    intent = parse_intent(req.transcript)
    return intent_to_dict(intent)
