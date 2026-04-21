import axios from 'axios'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { Send, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import Editor from '@monaco-editor/react';

function WebsiteEditor() {
    const { id } = useParams()

    const [website, setWebsite] = useState({
        title: "Generated Website",
        deployed: false
    })
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const iframeRef = useRef(null)
    const [loading, setLoading] = useState(false)

    // ✅ GENERATE WEBSITE
    const handleGenerate = async () => {
        if (!prompt) return
        setLoading(true)

        try {
            const res = await axios.post(
                `${serverUrl}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )

            console.log(res)

            setCode(res.data.code || "<h1>No Code Generated</h1>")
            setMessages((m) => [...m, { role: "user", content: prompt }])
            setMessages((m) => [...m, { role: "ai", content: "Website generated successfully 🚀" }])

            setPrompt("")
        } catch (err) {
            console.log(err)
        }

        setLoading(false)
    }

    // ✅ PREVIEW UPDATE
    useEffect(() => {
        if (!iframeRef.current || !code) return

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
                        className='flex-1 px-3 py-2 bg-white/10 rounded'
                        placeholder='Describe your website...'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        onClick={handleGenerate}
                        className='bg-white text-black px-3 rounded'
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>

            {/* RIGHT PREVIEW */}
            <div className='flex-1 flex flex-col'>

                <div className='h-12 flex items-center px-4 border-b border-white/10'>
                    Live Preview
                </div>

                <iframe
                    ref={iframeRef}
                    className='flex-1 bg-white'
                    sandbox='allow-scripts allow-same-origin'
                />
            </div>

        </div>
    )
}

export default WebsiteEditor