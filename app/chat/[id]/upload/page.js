'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function UploadPage() {
    const { id } = useParams()

    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const uploadFile = async () => {
        if (!file) return

        setLoading(true)

        const formData = new FormData()

        formData.append('file', file)
        formData.append('botId', id)

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()

        alert(data.success ? 'Uploaded!' : data.message)

        setLoading(false)
    }

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">
                Upload Knowledge Base
            </h1>

            <input
                type="file"
                accept=".txt,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button
                onClick={uploadFile}
                className="bg-black text-white px-6 py-2 rounded ml-4"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    )
}