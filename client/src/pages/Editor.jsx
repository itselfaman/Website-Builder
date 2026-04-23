import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { serverUrl } from '../App'
import { Send } from 'lucide-react'

function WebsiteEditor() {

    const [code, setCode] = useState("")
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

            const files = res.data.files || []

            const htmlFile = files.find(f => f.path.includes("html"))
            const cssFile = files.find(f => f.path.endsWith(".css"))
            const jsFile = files.find(f => f.path.endsWith(".js"))

            let finalHtml = htmlFile?.content || "<h1>No HTML</h1>"

            // ✅ SAFE CSS INJECT
            if (cssFile) {
                finalHtml = `
                <style>${cssFile.content}</style>
                ${finalHtml}
                `
            }

            // ✅ SAFE JS INJECT
            if (jsFile) {
                finalHtml = `
                ${finalHtml}
                <script>${jsFile.content}</script>
                `
            }

            setCode(finalHtml)

            setMessages(prev => [
                ...prev,
                { role: "user", content: prompt },
                { role: "ai", content: "Website generated 🚀" }
            ])

            setPrompt("")

        } catch (err) {
            console.log(err.response?.data)
            alert(err.response?.data?.message || "Error ❌")
        }

        setLoading(false)
    }

    // 🔥 FIX: USE srcDoc (IMPORTANT)
    useEffect(() => {
        if (iframeRef.current && code) {
            iframeRef.current.srcdoc = code
        }
    }, [code])

    return (
        <div className='h-screen w-screen flex bg-black text-white'>

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