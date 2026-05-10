// import { ArrowLeft } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { motion } from "motion/react"
// import axios from "axios"
// import { serverUrl } from '../App'

// const PHASES = [
//     "Analyzing your idea…",
//     "Designing layout & structure…",
//     "Writing HTML & CSS…",
//     "Adding animations & interactions…",
//     "Final quality checks…",
// ];

// function Generate() {
//     const navigate = useNavigate()

//     const [prompt, setPrompt] = useState("")
//     const [loading, setLoading] = useState(false)
//     const [progress, setProgress] = useState(0)
//     const [phaseIndex, setPhaseIndex] = useState(0)
//     const [error, setError] = useState("")
//     const [websiteId, setWebsiteId] = useState("")   // 🔥 NEW

//     // =========================
//     // 🔥 GENERATE WEBSITE
//     // =========================
//     const handleGenerateWebsite = async () => {
//         if (!prompt.trim()) return

//         setLoading(true)
//         setError("")

//         try {
//             const result = await axios.post(
//                 `${serverUrl}/api/website/generate`,
//                 { prompt },
//                 { withCredentials: true, timeout: 120000 }
//             )

//             console.log("API SUCCESS:", result)

//             setWebsiteId(result.data.websiteId)   // 🔥 STORE ID
//             setProgress(100)

//             // 👉 direct editor open
//             navigate(`/editor/${result.data.websiteId}`)

//         } catch (error) {
//             console.log("API ERROR:", error)

//             setError(
//                 error?.response?.data?.message ||
//                 error.message ||
//                 "Something went wrong"
//             )
//         } finally {
//             setLoading(false)
//         }
//     }

//     // =========================
//     // 🔥 DOWNLOAD ZIP
//     // =========================
//     const handleDownload = () => {
//         if (!websiteId) {
//             alert("Generate website first!")
//             return
//         }

//         window.open(`${serverUrl}/api/website/download/${websiteId}`)
//     }

//     // =========================
//     // 🔥 PROGRESS ANIMATION
//     // =========================
//     useEffect(() => {
//         if (!loading) {
//             setPhaseIndex(0)
//             setProgress(0)
//             return
//         }

//         let value = 0
//         let phase = 0

//         const interval = setInterval(() => {
//             const increment = value < 20
//                 ? Math.random() * 1.5
//                 : value < 60
//                     ? Math.random() * 1.2
//                     : Math.random() * 0.6

//             value += increment

//             if (value >= 93) value = 93

//             phase = Math.min(
//                 Math.floor((value / 100) * PHASES.length),
//                 PHASES.length - 1
//             )

//             setProgress(Math.floor(value))
//             setPhaseIndex(phase)

//         }, 1200)

//         return () => clearInterval(interval)
//     }, [loading])

//     return (
//         <div className='min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>

//             {/* Header */}
//             <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
//                 <div className='max-w-7xl mx-auto px-6 h-16 flex items-center gap-4'>
//                     <button
//                         className='p-2 rounded-lg hover:bg-white/10 transition'
//                         onClick={() => navigate("/")}
//                     >
//                         <ArrowLeft size={16} />
//                     </button>
//                     <h1 className='text-lg font-semibold'>
//                         Genweb<span className='text-zinc-400'>.ai</span>
//                     </h1>
//                 </div>
//             </div>

//             {/* Main */}
//             <div className='max-w-6xl mx-auto px-6 py-16'>

//                 {/* Title */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-center mb-16"
//                 >
//                     <h1 className='text-4xl md:text-5xl font-bold mb-5'>
//                         Build Websites with
//                         <span className='block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
//                             Real AI Power
//                         </span>
//                     </h1>

//                     <p className='text-zinc-400 max-w-2xl mx-auto'>
//                         This process may take several minutes.
//                     </p>
//                 </motion.div>

//                 {/* Input */}
//                 <div className='mb-14'>
//                     <h2 className='text-xl font-semibold mb-2'>
//                         Describe your website
//                     </h2>

//                     <textarea
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         placeholder='Describe your website in detail...'
//                         className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm focus:ring-2 focus:ring-white/20'
//                     />

//                     {error && (
//                         <p className='mt-4 text-sm text-red-400'>
//                             {error}
//                         </p>
//                     )}
//                 </div>

//                 {/* Buttons */}
//                 <div className='flex justify-center gap-4 flex-wrap'>
                    
//                     {/* Generate */}
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.96 }}
//                         onClick={handleGenerateWebsite}
//                         disabled={!prompt.trim() || loading}
//                         className={`px-14 py-4 rounded-2xl font-semibold text-lg ${
//                             prompt.trim() && !loading
//                                 ? "bg-white text-black"
//                                 : "bg-white/20 text-zinc-400 cursor-not-allowed"
//                         }`}
//                     >
//                         {loading ? "Generating..." : "Generate Website"}
//                     </motion.button>

//                     {/* 🔥 Download Button */}
//                     <button
//                         onClick={handleDownload}
//                         className="px-10 py-4 rounded-2xl bg-green-500 hover:bg-green-600 transition text-white font-semibold"
//                     >
//                         Download ZIP
//                     </button>

//                 </div>

//                 {/* Progress */}
//                 {loading && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="max-w-xl mx-auto mt-12"
//                     >
//                         <div className='flex justify-between mb-2 text-xs text-zinc-400'>
//                             <span>{PHASES[phaseIndex]}</span>
//                             <span>{progress}%</span>
//                         </div>

//                         <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
//                             <motion.div
//                                 className="h-full bg-gradient-to-r from-white to-zinc-300"
//                                 animate={{ width: `${progress}%` }}
//                                 transition={{ ease: "easeOut", duration: 0.8 }}
//                             />
//                         </div>
//                     </motion.div>
//                 )}

//             </div>
//         </div>
//     )
// }

// export default Generate



import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import axios from "axios"
import { serverUrl } from '../App'

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
];

function Generate() {
    const navigate = useNavigate()

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")

    // =========================
    // 🔥 GENERATE WEBSITE
    // =========================
    const handleGenerateWebsite = async () => {
        if (!prompt.trim()) return

        setLoading(true)
        setError("")

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                { prompt },
                { withCredentials: true, timeout: 120000 }
            )

            console.log("API SUCCESS:", result)

            setProgress(100)

            // 👉 redirect to editor
            navigate(`/editor/${result.data.websiteId}`)

        } catch (error) {
            console.log("API ERROR:", error)

            setError(
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }

    // =========================
    // 🔥 PROGRESS ANIMATION
    // =========================
    useEffect(() => {
        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {
            const increment = value < 20
                ? Math.random() * 1.5
                : value < 60
                    ? Math.random() * 1.2
                    : Math.random() * 0.6

            value += increment

            if (value >= 93) value = 93

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className='min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>

            {/* Header */}
            <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center gap-4'>
                    <button
                        className='p-2 rounded-lg hover:bg-white/10 transition'
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <h1 className='text-lg font-semibold'>
                        Genweb<span className='text-zinc-400'>.ai</span>
                    </h1>
                </div>
            </div>

            {/* Main */}
            <div className='max-w-6xl mx-auto px-6 py-16'>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-5'>
                        Build Websites with
                        <span className='block bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
                            Real AI Power
                        </span>
                    </h1>

                    <p className='text-zinc-400 max-w-2xl mx-auto'>
                        This process may take several minutes.
                    </p>
                </motion.div>

                {/* Input */}
                <div className='mb-14'>
                    <h2 className='text-xl font-semibold mb-2'>
                        Describe your website
                    </h2>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Describe your website in detail...'
                        className='w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 outline-none resize-none text-sm focus:ring-2 focus:ring-white/20'
                    />

                    {error && (
                        <p className='mt-4 text-sm text-red-400'>
                            {error}
                        </p>
                    )}
                </div>

                {/* Button */}
                <div className='flex justify-center'>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleGenerateWebsite}
                        disabled={!prompt.trim() || loading}
                        className={`px-14 py-4 rounded-2xl font-semibold text-lg ${
                            prompt.trim() && !loading
                                ? "bg-white text-black"
                                : "bg-white/20 text-zinc-400 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Generating..." : "Generate Website"}
                    </motion.button>
                </div>

                {/* Progress */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-xl mx-auto mt-12"
                    >
                        <div className='flex justify-between mb-2 text-xs text-zinc-400'>
                            <span>{PHASES[phaseIndex]}</span>
                            <span>{progress}%</span>
                        </div>

                        <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                            <motion.div
                                className="h-full bg-gradient-to-r from-white to-zinc-300"
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                            />
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    )
}

export default Generate