"use client";

import { useState } from "react";

type PreviewData = {
  title?: string;
  description?: string;
  image?: { url: string };
  logo?: { url: string };
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePreview = async () => {
    setError("");
    setData(null);

    if (!url) {
      setError("Please enter a URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Invalid URL format.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/preview?url=${url}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed request");
      }

      setData(result.data);
    } catch {
      setError("Unable to fetch preview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-white to-blue-200 overflow-hidden px-4">

      {/* Floating Background Shapes */}
      <div className="absolute w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="relative w-full max-w-2xl space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            LinkVista
          </h1>
          <p className="text-gray-600 text-lg">
            Turn any link into a beautiful preview card instantly.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-6 space-y-4 transition hover:shadow-3xl">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            <button
              onClick={handlePreview}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Preview"}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded-xl text-sm animate-fadeIn">
              {error}
            </div>
          )}
        </div>

        {/* Preview Card */}
        {data && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition duration-300 hover:scale-[1.02]">
            {data.image?.url && (
              <img
                src={data.image.url}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                {data.logo?.url && (
                  <img
                    src={data.logo.url}
                    alt="Favicon"
                    className="w-8 h-8 rounded-md"
                  />
                )}
                <h2 className="text-2xl font-semibold text-gray-900">
                  {data.title || "No title available"}
                </h2>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {data.description || "No description available."}
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}