import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const serverUrl = "https://website-builder-1-xgq2.onrender.com";

function Editor() {
  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [html, setHtml] = useState("");
  const [command, setCommand] = useState("");
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("preview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWebsite();
  }, [id]);

  // ============================================
  // FETCH WEBSITE
  // ============================================
  const fetchWebsite = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/website/get-by-id/${id}`
      );

      let data = res.data.files || [];

      // FIX STRING ISSUE
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      setFiles(data);

      if (data.length > 0) {
        setSelectedFile(data[0]);
      }

      buildPreview(data);

    } catch (err) {
      console.log("FETCH ERROR:", err);
    }
  };

  // ============================================
  // BUILD PREVIEW
  // ============================================
  const buildPreview = (filesData) => {

    if (!filesData || filesData.length === 0) {
      setHtml("<h1>No Files Found</h1>");
      return;
    }

    const htmlFile = filesData.find(
      (f) =>
        f.path.endsWith(".html") ||
        f.path.includes("index")
    );

    const cssFiles = filesData.filter((f) =>
      f.path.endsWith(".css")
    );

    const jsFiles = filesData.filter((f) =>
      f.path.endsWith(".js")
    );

    let finalHtml =
      htmlFile?.content ||
      `
      <html>
        <body style="font-family:sans-serif;padding:40px">
          <h1>No HTML File Found</h1>
        </body>
      </html>
      `;

    // ADD CSS
    cssFiles.forEach((css) => {
      finalHtml =
        `
        <style>
        ${css.content}
        </style>
        ` + finalHtml;
    });

    // ADD JS
    jsFiles.forEach((js) => {
      finalHtml += `
        <script>
          ${js.content}
        <\/script>
      `;
    });

    setHtml(finalHtml);
  };

  // ============================================
  // APPLY COMMAND
  // ============================================
  const handleCommand = async () => {

    if (!command.trim()) return;

    setLoading(true);

    // USER MESSAGE
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: command,
      },
    ]);

    try {

      const res = await axios.post(
        `${serverUrl}/api/website/generate`,
        {
          prompt: command,
          existingCode: JSON.stringify(files),
          websiteId: id,
        }
      );

      let updated = res.data.files || [];

      // FIX STRING ISSUE
      if (typeof updated === "string") {
        updated = JSON.parse(updated);
      }

      setFiles(updated);

      if (updated.length > 0) {
        setSelectedFile(updated[0]);
      }

      buildPreview(updated);

      // AI MESSAGE
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Website generated successfully 🚀",
        },
      ]);

      setCommand("");

    } catch (err) {

      console.log("COMMAND ERROR:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong ❌",
        },
      ]);
    }

    setLoading(false);
  };

  // ============================================
  // DOWNLOAD ZIP
  // ============================================
  const handleDownload = () => {
    window.open(
      `${serverUrl}/api/website/download/${id}`
    );
  };

  return (
    <div className="h-screen flex bg-[#020617] text-white overflow-hidden">

      {/* ========================================= */}
      {/* LEFT CHAT */}
      {/* ========================================= */}
      <div className="w-[340px] border-r border-white/10 bg-[#0f172a] flex flex-col">

        {/* HEADER */}
        <div className="p-5 border-b border-white/10">

          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI Builder
          </h1>

          <p className="text-zinc-400 text-sm mt-1">
            Build websites with prompts
          </p>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-auto p-4 space-y-4">

          {messages.length === 0 && (
            <div className="text-zinc-500 text-sm">
              Try:
              <br />
              "Create modern landing page"
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-cyan-400 text-black ml-8"
                  : "bg-white/10 mr-8"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-white/10">

          <textarea
            rows={3}
            value={command}
            onChange={(e) =>
              setCommand(e.target.value)
            }
            placeholder="Create modern todo website..."
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-sm outline-none resize-none"
          />

          <button
            onClick={handleCommand}
            disabled={loading}
            className="mt-3 w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading
              ? "Generating..."
              : "Generate Website"}
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* CENTER */}
      {/* ========================================= */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="h-16 border-b border-white/10 bg-[#0f172a] flex items-center justify-between px-6">

          <div className="flex gap-3">

            <button
              onClick={() => setView("preview")}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                view === "preview"
                  ? "bg-cyan-400 text-black"
                  : "bg-white/10"
              }`}
            >
              👁️ Preview
            </button>

            <button
              onClick={() => setView("code")}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                view === "code"
                  ? "bg-cyan-400 text-black"
                  : "bg-white/10"
              }`}
            >
              {"</>"} Code
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-400 px-5 py-2 rounded-xl text-sm font-semibold"
          >
            Download ZIP
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* FILES */}
          <div className="w-[240px] bg-[#0f172a] border-r border-white/10 overflow-auto p-3">

            <div className="text-zinc-400 text-sm mb-3">
              Files
            </div>

            {files.map((file, i) => (
              <div
                key={i}
                onClick={() => setSelectedFile(file)}
                className={`p-3 rounded-xl text-sm cursor-pointer mb-2 transition ${
                  selectedFile?.path === file.path
                    ? "bg-cyan-400 text-black"
                    : "hover:bg-white/10"
                }`}
              >
                {file.path}
              </div>
            ))}
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden bg-[#020617]">

            {/* CODE */}
            {view === "code" && selectedFile && (
              <div className="h-full overflow-auto p-6">

                <div className="text-zinc-400 text-sm mb-4">
                  {selectedFile.path}
                </div>

                <pre className="bg-black/40 p-5 rounded-2xl text-sm overflow-auto border border-white/10">
                  <code className="text-green-300">
                    {selectedFile.content}
                  </code>
                </pre>
              </div>
            )}

            {/* PREVIEW */}
            {view === "preview" && (
              <iframe
                srcDoc={html}
                title="preview"
                sandbox="allow-scripts"
                className="w-full h-full bg-white"
              />
            )}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* RIGHT MOBILE PREVIEW */}
      {/* ========================================= */}
      <div className="w-[380px] bg-[#111827] border-l border-white/10 flex items-center justify-center p-5">

        <div className="w-[320px] h-[650px] bg-black rounded-[40px] border-[8px] border-zinc-700 overflow-hidden shadow-2xl">

          <div className="h-6 bg-black flex justify-center items-center">
            <div className="w-20 h-2 bg-zinc-700 rounded-full"></div>
          </div>

          <iframe
            srcDoc={html}
            title="mobile-preview"
            sandbox="allow-scripts"
            className="w-full h-full bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;