import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  (typeof window !== "undefined"
    ? import.meta.env.VITE_API_BASE_URL
    : process.env.VITE_API_BASE_URL) || "http://localhost:8000/api";

export interface Voice {
  id: number;
  name?: string | null;
  provider: string;
  language: string;
  status: string;
  reference_url?: string | null;
  cache_object_path?: string | null;
  avatar?: string | null;
  creation_ms?: number | null;
  clone_params_json?: string | null;
  error?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Synthesis {
  id: number;
  provider: string;
  voice_id?: number | null;
  text: string;
  status: string;
  params_json: string;
  output_object_path?: string | null;
  error?: string | null;
  created_at: string;
  updated_at: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["Voices", "Syntheses"],
  endpoints: (builder) => ({
    listVoices: builder.query<Voice[], void>({
      query: () => ({ url: "/voices" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Voices" as const, id })),
              { type: "Voices" as const, id: "LIST" },
            ]
          : [{ type: "Voices" as const, id: "LIST" }],
    }),
    createVoice: builder.mutation<
      Voice,
      {
        name?: string;
        language?: string;
        provider?: string;
        reference_url: string;
        avatar?: string | null;
        xtts?: {
          max_ref_length?: number;
          gpt_cond_len?: number;
          gpt_cond_chunk_len?: number;
          sound_norm_refs?: boolean;
          librosa_trim_db?: number;
          load_sr?: number;
        };
      }
    >({
      query: (body) => ({
        url: "/voices",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Voices", id: "LIST" }],
    }),
    presignUpload: builder.mutation<
      { object_name: string; upload_url: string; download_url: string },
      { filename: string; content_type?: string; folder?: string }
    >({
      query: ({ filename, content_type, folder }) => ({
        url: "/files/presign",
        method: "POST",
        params: {
          filename,
          content_type,
          folder: folder || "uploads",
        },
      }),
    }),
    presignDownload: builder.query<{ object_name: string; download_url: string }, { object_name: string }>({
      query: ({ object_name }) => ({
        url: "/files/url",
        params: { object_name },
      }),
    }),
    listSyntheses: builder.query<Synthesis[], void>({
      query: () => ({ url: "/syntheses" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Syntheses" as const, id })),
              { type: "Syntheses" as const, id: "LIST" },
            ]
          : [{ type: "Syntheses" as const, id: "LIST" }],
    }),
    createSynthesis: builder.mutation<
      Synthesis,
      {
        text: string;
        provider?: "coqui" | "kokoro";
        voice_id?: number | null;
        language?: string | null;
        speed?: number | null;
        temperature?: number | null;
        top_p?: number | null;
        top_k?: number | null;
        length_penalty?: number | null;
        format?: "wav" | "mp3";
      }
    >({
      query: (body) => ({
        url: "/syntheses",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Syntheses", id: "LIST" }],
    }),
  }),
});

export const {
  useListVoicesQuery,
  useCreateVoiceMutation,
  useListSynthesesQuery,
  useCreateSynthesisMutation,
  usePresignUploadMutation,
  usePresignDownloadQuery,
} = api;
