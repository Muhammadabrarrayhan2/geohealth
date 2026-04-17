"""
Voice-assisted search intent parsing.

This is intentionally NOT a chatbot or diagnostic assistant. It is a
lightweight, deterministic keyword-to-filter mapper that turns a
transcribed voice command into concrete search parameters the UI
can apply.

Design goals:
- accessibility-first (works for users with weak motor control,
  elderly users, or users in urgent physical conditions)
- language-aware: handles common Indonesian and English phrasings
- predictable: same utterance → same filters
"""
import re
from dataclasses import dataclass, asdict
from typing import Optional


# Specialty triggers — include common EN + ID phrasings. The key on the
# left is the canonical specialty code used elsewhere in the app.
SPECIALTY_KEYWORDS: dict[str, list[str]] = {
    "emergency": [
        "emergency", "er", "ugd", "gawat darurat", "urgent",
    ],
    "pediatrics": [
        "pediatric", "pediatrics", "children", "kid", "child",
        "anak", "bayi", "pediatri",
    ],
    "maternity": [
        "maternity", "maternal", "pregnancy", "pregnant",
        "ibu hamil", "melahirkan", "bersalin",
    ],
    "cardiology": [
        "cardiology", "cardiac", "heart",
        "jantung", "kardiologi",
    ],
    "neurology": [
        "neurology", "neurological", "brain", "nerve", "stroke",
        "saraf", "neurologi", "otak",
    ],
    "oncology": [
        "oncology", "cancer", "tumor",
        "kanker", "onkologi",
    ],
    "orthopedics": [
        "orthopedic", "orthopedics", "bone", "fracture", "joint",
        "tulang", "ortopedi", "patah",
    ],
    "internal_medicine": [
        "internal medicine", "internist",
        "penyakit dalam", "interna",
    ],
    "surgery": [
        "surgery", "surgical",
        "bedah", "operasi",
    ],
    "radiology": [
        "radiology", "x-ray", "ct scan", "mri",
        "radiologi", "rontgen",
    ],
}

# Phrases that signal "nearest / closest to me".
NEAREST_KEYWORDS = [
    "nearest", "closest", "near me", "nearby", "close to me",
    "terdekat", "dekat saya", "paling dekat",
]

# Phrases that signal emergency / urgent intent.
EMERGENCY_KEYWORDS = [
    "emergency", "urgent", "asap", "now",
    "gawat darurat", "darurat", "ugd", "segera",
]


@dataclass
class VoiceIntent:
    specialty: Optional[str]
    emergency: bool
    wants_nearest: bool
    confidence: float    # 0.0 – 1.0, rough heuristic
    matched_keywords: list[str]
    raw_transcript: str


def _normalize(text: str) -> str:
    """Lowercase + collapse whitespace + strip punctuation."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def _contains_phrase(haystack: str, phrase: str) -> bool:
    """
    Word-boundary-aware containment check.

    Plain substring matching is unsafe here — short keywords like
    "er" (Emergency Room) or "ugd" would false-match inside longer
    words like "terdekat" or "ugdah". We require each whitespace-
    separated token in `phrase` to appear as its own token in
    `haystack`. Works for single words and multi-word phrases alike.
    """
    tokens = set(haystack.split())
    phrase_tokens = phrase.split()
    if len(phrase_tokens) == 1:
        return phrase_tokens[0] in tokens
    # Multi-word phrase: require it as a contiguous substring bounded
    # by word boundaries.
    pattern = r"\b" + re.escape(phrase) + r"\b"
    return re.search(pattern, haystack) is not None


def parse_intent(transcript: str) -> VoiceIntent:
    """
    Deterministic keyword-based intent parsing.

    Order of operations:
    1. Normalize the transcript.
    2. Scan for a specialty match (first hit wins — users usually ask
       for a single specialty at a time).
    3. Detect emergency vs. non-emergency intent.
    4. Detect whether the user wants the nearest hospital.
    5. Compute a rough confidence based on how many concrete signals
       we matched.
    """
    normalized = _normalize(transcript)
    matched: list[str] = []

    # --- specialty ---
    # Scan ALL specialties and collect every hit, then pick the best one.
    # Rule: a concrete medical specialty (cardiology, pediatrics, etc.)
    # always beats "emergency" for the specialty slot, because "emergency"
    # is better represented by the dedicated emergency flag below.
    # Example: "find the nearest emergency cardiology hospital" →
    #   specialty = cardiology, emergency = True.
    specialty_hits: list[tuple[str, str]] = []  # (code, keyword)
    for code, keywords in SPECIALTY_KEYWORDS.items():
        for kw in keywords:
            if _contains_phrase(normalized, kw):
                specialty_hits.append((code, kw))
                break   # one hit per code is enough

    specialty: Optional[str] = None
    if specialty_hits:
        # Prefer any non-"emergency" specialty; fall back to emergency only
        # if it's the sole match.
        non_er = [h for h in specialty_hits if h[0] != "emergency"]
        chosen = non_er[0] if non_er else specialty_hits[0]
        specialty = chosen[0]
        matched.append(chosen[1])

    # --- emergency intent ---
    # Triggered by either the emergency keyword list OR matching the
    # 'emergency' specialty keywords (so "UGD" / "gawat darurat" still
    # flag as emergency even when another specialty takes the slot).
    emergency_kw_matches = [kw for kw in EMERGENCY_KEYWORDS if _contains_phrase(normalized, kw)]
    emergency_specialty_hit = any(code == "emergency" for code, _ in specialty_hits)
    emergency = bool(emergency_kw_matches) or emergency_specialty_hit
    if emergency_kw_matches:
        matched.extend(emergency_kw_matches)
    if emergency_specialty_hit and not emergency_kw_matches:
        # Surface the specialty keyword that caused the ER flag.
        for code, kw in specialty_hits:
            if code == "emergency":
                matched.append(kw)
                break

    # --- nearest intent ---
    wants_nearest = any(_contains_phrase(normalized, kw) for kw in NEAREST_KEYWORDS)
    if wants_nearest:
        matched.extend(kw for kw in NEAREST_KEYWORDS if _contains_phrase(normalized, kw))

    # --- confidence heuristic ---
    signals = sum([bool(specialty), emergency, wants_nearest])
    confidence = min(1.0, 0.25 + 0.25 * signals)

    return VoiceIntent(
        specialty=specialty,
        emergency=emergency,
        wants_nearest=wants_nearest,
        confidence=round(confidence, 2),
        matched_keywords=sorted(set(matched)),
        raw_transcript=transcript,
    )


def intent_to_dict(intent: VoiceIntent) -> dict:
    return asdict(intent)
