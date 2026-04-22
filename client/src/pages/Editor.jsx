import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { serverUrl } from '../App'
import { Send } from 'lucide-react'

function WebsiteEditor() {

    const [code, setCode] = useState("")
    const [files, setFiles] = useState([])
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [loading, setLoading] = useState(false)

    const handleGenerate = async () => {

        if (!prompt.trim()) {
            alert("Enter prompt first 😅")
            return
        }

        setLoading(true)

        try {
            const res = await axios.post(
                `${serverUrl}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )

            console.log("FULL RESPONSE:", res.data)

            const filesData = res.data.files || []
            setFiles(filesData)

            // 🔍 DEBUG
            filesData.forEach(f => console.log("FILE:", f.path))

            // ✅ FIND HTML FILE
            const htmlFile = filesData.find(file =>
                file.path.toLowerCase().includes(".html")
            )

            if (htmlFile) {
                console.log("✅ HTML FOUND:", htmlFile.path)
                setCode(htmlFile.content)
            } else {
                console.log("❌ NO HTML FILE FOUND")

                // ⚠️ FALLBACK MESSAGE
                setCode(`
                    <html>
                        <body style="font-family:sans-serif;text-align:center;padding-top:50px;">
                            <h2>⚠️ Preview not available</h2>
                            <p>This project is not HTML based</p>
                            <p>👉 Try this prompt:</p>
                            <code>Create a website using HTML CSS JS with index.html</code>
                        </body>
                    </html>
                `)
            }

            setMessages((prev) => [
                ...prev,
                { role: "user", content: prompt },
                { role: "ai", content: "Website generated successfully 🚀" }
            ])

            setPrompt("")

        } catch (err) {
            console.log("ERROR:", err.response?.data)
            alert(err.response?.data?.message || "API Error ❌")
        }

        setLoading(false)
    }

    useEffect(() => {
        if (!iframeRef.current || !code) return

        console.log("⚡ RENDERING IN IFRAME")

        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)

        iframeRef.current.src = url

        return () => URL.revokeObjectURL(url)
    }, [code])

    return (
        <div className='h-screen w-screen flex bg-black text-white'>

            {/* LEFT PANEL */}
            <div className='w-[350px] border-r border-white/10 flex flex-col'>

                <div className='p-4 font-semibold border-b border-white/10'>
                    AI Chat
                </div>

                <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                    {messages.map((m, i) => (
                        <div key={i} className={m.role === "user" ? "text-right" : ""}>
                            <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
                                m.role === "user"
                                    ? "bg-white text-black"
                                    : "bg-white/10"
                            }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='p-3 border-t border-white/10 flex gap-2'>
                    <input
                        className='flex-1 px-3 py-2 bg-white/10 rounded outline-none'
                        placeholder='Describe your website...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />

                    <button
                        onClick={handleGenerate}
                        className='bg-white text-black px-4 rounded'
                    >
                        {loading ? "..." : <Send size={14} />}
                    </button>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className='flex-1 flex flex-col'>

                <div className='h-12 flex items-center px-4 border-b border-white/10'>
                    Live Preview
                </div>

                {!code ? (
                    <div className='flex-1 flex items-center justify-center text-gray-400'>
                        Generate a website to preview 🚀
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        className='flex-1 bg-white'
                        sandbox='allow-scripts allow-same-origin'
                        title="preview"
                    />
                )}
            </div>

        </div>
    )
}

export default WebsiteEditor