'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function UploadPage() {
    const { id } = useParams()

    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState([])

    // Load uploaded documents
    const loadDocuments = async () => {
        const res = await fetch('/api/documents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                botId: id,
            }),
        })

        const data = await res.json()

        if (data.success) {
            setDocuments(data.documents)
        }
    }

    useEffect(() => {
        if (id) {
            loadDocuments()
        }
    }, [id])
    const deleteDocument = async (documentId) => {
        const confirmed = confirm(
            'Are you sure you want to delete this document?'
        )

        if (!confirmed) return

        const res = await fetch(
            '/api/delete-documents',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId,
                }),
            }
        )

        const data = await res.json()

        if (data.success) {
            loadDocuments()
        }
    }

    // Upload file
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

        alert(
            data.success
                ? 'Upload Successful 🎉'
                : data.message
        )

        if (data.success) {
            setFile(null)
            loadDocuments()
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Upload Card */}
                <div className="bg-white shadow-xl rounded-3xl p-10">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Upload Knowledge Base
                        </h1>

                        <p className="text-gray-500 mt-3">
                            Upload PDF or TXT files to train your chatbot.
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-black transition">

                        <div className="text-6xl mb-4">
                            📄
                        </div>

                        <p className="text-gray-600 mb-6">
                            Choose a PDF or TXT file
                        </p>

                        <label className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-xl font-medium transition">
                            Choose File

                            <input
                                type="file"
                                accept=".txt,.pdf"
                                className="hidden"
                                onChange={(e) =>
                                    setFile(e.target.files[0])
                                }
                            />
                        </label>

                        {file && (
                            <div className="mt-6 bg-gray-50 rounded-xl p-4">
                                <p className="font-semibold text-gray-700">
                                    Selected File
                                </p>

                                <p className="text-sm text-gray-500 mt-2">
                                    📄 {file.name}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={uploadFile}
                        disabled={!file || loading}
                        className="w-full mt-8 bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
                    >
                        {loading
                            ? 'Uploading...'
                            : 'Upload Document'}
                    </button>
                </div>

                {/* Uploaded Documents */}
                <div className="mt-8 bg-white shadow-xl rounded-3xl p-8">
                    <h2 className="text-2xl font-bold mb-6">
                        Uploaded Documents
                    </h2>

                    {documents.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                            No documents uploaded yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="border rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            📄 {doc.filename}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Uploaded successfully
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteDocument(doc.id)
                                        }
                                        className="text-red-500 hover:text-red-700 text-xl"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}