"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, X } from "lucide-react";
import { api } from "@/lib/api";
import { cn, specialtyLabel } from "@/lib/utils";
import type { VoiceIntent } from "@/lib/types";

interface Props {
  onIntent: (intent: VoiceIntent) => void;
}

// SpeechRecognition vendor prefixes — wrapped in a type escape because
// the Web Speech API isn't fully in the TS DOM lib.
function getRecognition(): any | null {
  if (typeof window === "undefined") return null;
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return SR ? new SR() : null;
}

const SUGGESTIONS = [
  "Find the nearest emergency hospital",
  "I need a cardiology hospital near me",
  "Show nearby pediatric hospitals",
  "Find a hospital with oncology services",
];

export function VoiceSearchButton({ onIntent }: Props) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [lastIntent, setLastIntent] = useState<VoiceIntent | null>(null);
  const [typedFallback, setTypedFallback] = useState("");
  const recognitionRef = useRef<any>(null);

  // Detect support on mount
  useEffect(() => {
    setSupported(!!getRecognition());
  }, []);

  const startListening = () => {
    const rec = getRecognition();
    if (!rec) { setSupported(false); return; }
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onstart = () => { setListening(true); setTranscript(""); };
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(text);
    };
    rec.onend = async () => {
      setListening(false);
      const finalText = (rec._finalText ?? transcript) || transcript;
      if (finalText.trim()) {
        await submitTranscript(finalText.trim());
      }
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const submitTranscript = async (text: string) => {
    try {
      const intent = await api.parseVoice(text);
      setLastIntent(intent);
      onIntent(intent);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFallbackSubmit = async () => {
    if (!typedFallback.trim()) return;
    setTranscript(typedFallback);
    await submitTranscript(typedFallback.trim());
    setTypedFallback("");
  };

  return (
    <>
      {/* Trigger button — visually distinct, invites tapping */}
      <button
        onClick={() => setOpen(true)}
        className="group relative inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-paper shadow-soft transition hover:bg-ink-soft"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-compass-400 opacity-75 group-hover:animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-compass-300" />
        </span>
        <Mic size={15} />
        Voice search
      </button>

      {/* Modal sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => { stopListening(); setOpen(false); }}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-paper p-6 shadow-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-compass-600">
                  Accessibility · Voice search
                </div>
                <h3 className="mt-1 font-display text-2xl font-medium leading-tight text-ink">
                  Ask for a hospital
                </h3>
              </div>
              <button
                onClick={() => { stopListening(); setOpen(false); }}
                className="rounded-full p-1.5 text-ink-muted hover:bg-ink/5"
                aria-label="Close voice search"
              >
                <X size={18} />
              </button>
            </div>

            {supported ? (
              <>
                <div className="mt-6 flex flex-col items-center">
                  <button
                    onClick={listening ? stopListening : startListening}
                    className={cn(
                      "relative flex h-24 w-24 items-center justify-center rounded-full transition",
                      listening
                        ? "bg-coral-500 text-white"
                        : "bg-compass-600 text-white hover:bg-compass-700"
                    )}
                    aria-label={listening ? "Stop listening" : "Start listening"}
                  >
                    {listening && (
                      <span className="absolute inset-0 rounded-full bg-coral-500/40 geo-pulse" />
                    )}
                    {listening ? <MicOff size={32} /> : <Mic size={32} />}
                  </button>
                  <div className="mt-4 text-sm font-medium text-ink">
                    {listening ? "Listening…" : "Tap to speak"}
                  </div>
                  <div className="mt-1 text-xs text-ink-muted text-center">
                    Browser speech recognition · No audio is stored
                  </div>
                </div>

                {transcript && (
                  <div className="mt-5 rounded-2xl bg-paper-warm p-4">
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      Heard
                    </div>
                    <div className="mt-1 text-sm italic text-ink">"{transcript}"</div>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-5 rounded-2xl bg-amber-400/10 border border-amber-400/30 p-4 text-sm text-ink-soft">
                Voice input isn't supported in this browser. You can type your
                query below instead — it will be parsed the same way.
              </div>
            )}

            {/* Typed fallback — always available */}
            <div className="mt-5">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-2">
                Or type your request
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedFallback}
                  onChange={(e) => setTypedFallback(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFallbackSubmit()}
                  placeholder="e.g. Find the nearest cardiology hospital"
                  className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm outline-none focus:border-compass-500"
                />
                <button
                  onClick={handleFallbackSubmit}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Example commands */}
            <div className="mt-5">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-2">
                Try saying
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submitTranscript(s)}
                    className="rounded-full border border-ink/10 bg-paper px-3 py-1.5 text-xs text-ink-soft hover:bg-paper-warm"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>

            {lastIntent && (
              <div className="mt-5 rounded-2xl border border-compass-200 bg-compass-50 p-4">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-compass-700">
                  Applied filters
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                  {lastIntent.specialty && (
                    <span className="rounded-full bg-white px-2.5 py-1 font-medium text-compass-700">
                      {specialtyLabel(lastIntent.specialty)}
                    </span>
                  )}
                  {lastIntent.emergency && (
                    <span className="rounded-full bg-coral-500 px-2.5 py-1 font-medium text-white">
                      Emergency
                    </span>
                  )}
                  {lastIntent.wants_nearest && (
                    <span className="rounded-full bg-white px-2.5 py-1 font-medium text-compass-700">
                      Nearest
                    </span>
                  )}
                  <span className="rounded-full bg-white px-2.5 py-1 text-ink-muted">
                    Confidence: {Math.round(lastIntent.confidence * 100)}%
                  </span>
                </div>
                <button
                  onClick={() => { setOpen(false); stopListening(); }}
                  className="mt-3 w-full rounded-full bg-compass-600 py-2 text-sm font-medium text-white hover:bg-compass-700"
                >
                  See results →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
