import { useEffect, useState } from "react";
import {
  useCreateSynthesisMutation,
  useCreateVoiceMutation,
  useListSynthesesQuery,
  useListVoicesQuery,
  usePresignDownloadQuery,
  usePresignUploadMutation,
} from "../../state/api";
import type { Synthesis } from "../../state/api";
import type { Voice } from "../../state/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerSpeed,
  AudioPlayerTime,
  useAudioPlayer,
} from "@/components/ui/audio-player";

export function meta() {
  return [
    { title: "Mouthpiece" },
    {
      name: "description",
      content: "Clone voices with Coqui; synthesize with Coqui or Kokoro.",
    },
  ];
}

export default function Index() {
  const { data: voices = [], isFetching: fetchingVoices } =
    useListVoicesQuery();
  const { data: synths = [], isFetching: fetchingSynths } =
    useListSynthesesQuery();
  const [createVoice, { isLoading: creatingVoice, isSuccess: voiceSuccess }] =
    useCreateVoiceMutation();
  const [createSynth, { isLoading: creatingSynth }] =
    useCreateSynthesisMutation();
  const [presignUpload] = usePresignUploadMutation();

  const [voiceName, setVoiceName] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("en");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [xttsMaxRefLength, setXttsMaxRefLength] = useState("");
  const [xttsGptCondLen, setXttsGptCondLen] = useState("");
  const [xttsGptCondChunkLen, setXttsGptCondChunkLen] = useState("");
  const [xttsSoundNormRefs, setXttsSoundNormRefs] = useState("");
  const [xttsLibrosaTrimDb, setXttsLibrosaTrimDb] = useState("");
  const [xttsLoadSr, setXttsLoadSr] = useState("");

  const [text, setText] = useState("Hello from Mouthpiece!");
  const [provider, setProvider] = useState<"coqui" | "kokoro">("coqui");
  const [voiceId, setVoiceId] = useState<number | undefined>();
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (voiceSuccess) {
      setVoiceName("");
      setReferenceFile(null);
      setAvatarFile(null);
      setXttsMaxRefLength("");
      setXttsGptCondLen("");
      setXttsGptCondChunkLen("");
      setXttsSoundNormRefs("");
      setXttsLibrosaTrimDb("");
      setXttsLoadSr("");
    }
  }, [voiceSuccess]);

  const onCreateVoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceFile) {
      alert("Reference audio file is required.");
      return;
    }

    const refPresign = await presignUpload({
      filename: referenceFile.name,
      content_type: referenceFile.type,
      folder: "voices/raw",
    }).unwrap();
    await fetch(refPresign.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": referenceFile.type || "application/octet-stream",
      },
      body: referenceFile,
    });

    let avatarUrl: string | undefined;
    if (avatarFile) {
      const avatarPresign = await presignUpload({
        filename: avatarFile.name,
        content_type: avatarFile.type,
        folder: "voices/avatars",
      }).unwrap();
      await fetch(avatarPresign.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": avatarFile.type || "application/octet-stream",
        },
        body: avatarFile,
      });
      avatarUrl = avatarPresign.download_url;
    }

    const xtts: Record<string, unknown> = {};
    if (xttsMaxRefLength) xtts.max_ref_length = Number(xttsMaxRefLength);
    if (xttsGptCondLen) xtts.gpt_cond_len = Number(xttsGptCondLen);
    if (xttsGptCondChunkLen)
      xtts.gpt_cond_chunk_len = Number(xttsGptCondChunkLen);
    if (xttsSoundNormRefs === "true") xtts.sound_norm_refs = true;
    if (xttsSoundNormRefs === "false") xtts.sound_norm_refs = false;
    if (xttsLibrosaTrimDb) xtts.librosa_trim_db = Number(xttsLibrosaTrimDb);
    if (xttsLoadSr) xtts.load_sr = Number(xttsLoadSr);

    await createVoice({
      name: voiceName || undefined,
      language: voiceLanguage,
      provider: "coqui",
      reference_url: refPresign.download_url,
      avatar: avatarUrl,
      xtts: Object.keys(xtts).length ? (xtts as any) : undefined,
    }).unwrap();
  };

  const onCreateSynth = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSynth({
      text,
      provider,
      voice_id: provider === "coqui" ? (voiceId ?? null) : null,
      language,
    }).unwrap();
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              1) Clone a voice (upload to bucket)
            </h2>
            {creatingVoice && (
              <span className="text-xs text-amber-600">Processing…</span>
            )}
          </div>
          <form
            onSubmit={onCreateVoice}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">Name</span>
                <input
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  placeholder="My voice"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">Language</span>
                <select
                  value={voiceLanguage}
                  onChange={(e) => setVoiceLanguage(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {["en", "es", "fr", "de", "hi", "ja", "zh"].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">Reference audio file</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    setReferenceFile(e.target.files?.[0] ?? null)
                  }
                  className="w-full text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-500"
                  required
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">Avatar image (optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-slate-700 file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white hover:file:bg-emerald-500"
                />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">XTTS: max_ref_length</span>
                <input
                  value={xttsMaxRefLength}
                  onChange={(e) => setXttsMaxRefLength(e.target.value)}
                  inputMode="numeric"
                  placeholder="default"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">XTTS: gpt_cond_len</span>
                <input
                  value={xttsGptCondLen}
                  onChange={(e) => setXttsGptCondLen(e.target.value)}
                  inputMode="numeric"
                  placeholder="default"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">XTTS: gpt_cond_chunk_len</span>
                <input
                  value={xttsGptCondChunkLen}
                  onChange={(e) => setXttsGptCondChunkLen(e.target.value)}
                  inputMode="numeric"
                  placeholder="default"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">XTTS: sound_norm_refs</span>
                <select
                  value={xttsSoundNormRefs}
                  onChange={(e) => setXttsSoundNormRefs(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">default</option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">XTTS: librosa_trim_db</span>
                <input
                  value={xttsLibrosaTrimDb}
                  onChange={(e) => setXttsLibrosaTrimDb(e.target.value)}
                  inputMode="numeric"
                  placeholder="default"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">XTTS: load_sr</span>
                <input
                  value={xttsLoadSr}
                  onChange={(e) => setXttsLoadSr(e.target.value)}
                  inputMode="numeric"
                  placeholder="default"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={creatingVoice}
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60"
            >
              Create voice
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">2) Voices</h2>
            {fetchingVoices && (
              <span className="text-xs text-slate-500">Loading…</span>
            )}
          </div>
          {voices.length === 0 ? (
            <p className="text-sm text-slate-500">
              No voices yet. Create one above.
            </p>
          ) : (
            <AudioPlayerProvider>
              <div className="grid gap-3 md:grid-cols-2">
                {voices.map((v) => (
                  <VoiceCard key={v.id} voice={v} />
                ))}
              </div>
            </AudioPlayerProvider>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">3) Synthesize speech</h2>
            {creatingSynth && (
              <span className="text-xs text-amber-600">Submitting…</span>
            )}
          </div>
          <form
            onSubmit={onCreateSynth}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="grid gap-3 md:grid-cols-3">
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">Provider</span>
                <select
                  value={provider}
                  onChange={(e) =>
                    setProvider(e.target.value as "coqui" | "kokoro")
                  }
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="coqui">Coqui (cloned)</option>
                  <option value="kokoro">Kokoro (stock)</option>
                </select>
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-slate-700">Language</span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  {["en", "es", "fr", "de", "hi", "ja", "zh"].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>
              {provider === "coqui" && (
                <label className="block space-y-1 text-sm">
                  <span className="text-slate-700">Voice</span>
                  <select
                    value={voiceId ?? ""}
                    onChange={(e) =>
                      setVoiceId(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select a voice</option>
                    {voices.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name || `Voice ${v.id}`} ({v.status})
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
            <label className="block space-y-1 text-sm">
              <span className="text-slate-700">Text</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <button
              type="submit"
              disabled={creatingSynth}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
            >
              Create synthesis
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">4) Syntheses</h2>
            {fetchingSynths && (
              <span className="text-xs text-slate-500">Loading…</span>
            )}
          </div>
          {synths.length === 0 ? (
            <p className="text-sm text-slate-500">No syntheses yet.</p>
          ) : (
            <AudioPlayerProvider>
              <div className="grid gap-3 md:grid-cols-2">
                {synths.map((s) => (
                  <SynthesisCard key={s.id} synthesis={s} />
                ))}
              </div>
            </AudioPlayerProvider>
          )}
        </section>
      </div>
    </main>
  );
}

function statusVariant(status: string) {
  switch (status) {
    case "ready":
      return "default" as const;
    case "processing":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function VoiceCard({ voice }: { voice: Voice }) {
  const player = useAudioPlayer();
  const hasAudio = Boolean(voice.reference_url);
  const item = hasAudio ? { id: voice.id, src: voice.reference_url! } : null;
  const isActive = item ? player.isItemActive(item.id) : false;

  return (
    <Card size="sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-3">
          <Avatar size="lg">
            {voice.avatar ? (
              <AvatarImage
                src={voice.avatar}
                alt={voice.name || `Voice ${voice.id}`}
              />
            ) : (
              <AvatarFallback>
                {(voice.name?.[0] || "V").toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <div className="truncate">{voice.name || `Voice ${voice.id}`}</div>
            <div className="text-muted-foreground text-xs">
              {voice.provider} · {voice.language}
              {voice.creation_ms ? ` · ${voice.creation_ms}ms` : ""}
            </div>
          </div>
        </CardTitle>
        <CardAction className="flex items-center gap-2">
          <Badge variant={statusVariant(voice.status)}>{voice.status}</Badge>
          {item && (
            <>
              <AudioPlayerButton item={item} variant="outline" size="icon" />
              {isActive && <AudioPlayerSpeed />}
            </>
          )}
        </CardAction>
      </CardHeader>
      {voice.error && (
        <CardContent>
          <p className="text-xs text-red-600">Error: {voice.error}</p>
        </CardContent>
      )}
      {item && isActive && (
        <CardContent className="space-y-2">
          <AudioPlayerProgress />
          <div className="flex items-center justify-between">
            <AudioPlayerTime className="text-xs" />
            <AudioPlayerDuration className="text-xs" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function SynthesisCard({ synthesis }: { synthesis: Synthesis }) {
  const player = useAudioPlayer();
  const hasOutput = Boolean(synthesis.output_object_path);
  const objectName = synthesis.output_object_path || "";

  const { data, isFetching } = usePresignDownloadQuery(
    { object_name: objectName },
    { skip: !hasOutput },
  );

  const item =
    data?.download_url && hasOutput
      ? { id: synthesis.id, src: data.download_url }
      : null;

  const isActive = item ? player.isItemActive(item.id) : false;

  return (
    <Card size="sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <span className="capitalize">{synthesis.provider}</span>
          <span className="text-muted-foreground">·</span>
          <span>
            {synthesis.voice_id ? `Voice ${synthesis.voice_id}` : "No voice"}
          </span>
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {synthesis.text}
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Badge variant={statusVariant(synthesis.status)}>
            {synthesis.status}
          </Badge>
          {hasOutput && isFetching && (
            <Badge variant="secondary">Loading audio</Badge>
          )}
          {hasOutput && item && (
            <>
              <AudioPlayerButton item={item} variant="outline" size="icon" />
              {isActive && <AudioPlayerSpeed />}
            </>
          )}
        </CardAction>
      </CardHeader>
      {synthesis.error && (
        <CardContent>
          <p className="text-xs text-red-600">Error: {synthesis.error}</p>
        </CardContent>
      )}
      {hasOutput && isActive && (
        <CardContent className="space-y-2">
          <AudioPlayerProgress />
          <div className="flex items-center justify-between">
            <AudioPlayerTime className="text-xs" />
            <AudioPlayerDuration className="text-xs" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
