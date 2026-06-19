import supabase from '@/app/lib/supabase'
import pdfParse from 'pdf-parse'
import { chunkText } from '@/app/lib/chunkText'

export async function POST(req) {
    try {
        const formData = await req.formData()

        const file = formData.get('file')
        const botId = formData.get('botId')

        if (!file) {
            return Response.json({
                success: false,
                message: 'No file uploaded',
            })
        }

        let text = ''

        if (file.name.endsWith('.txt')) {
            text = await file.text()
        } else if (file.name.endsWith('.pdf')) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const pdfData = await pdfParse(buffer)

            text = pdfData.text
        } else {
            return Response.json({
                success: false,
                message: 'Only TXT and PDF files supported',
            })
        }

        // Create chunks AFTER text extraction
        const chunks = chunkText(text)
        console.log("CHUNKS CREATED:", chunks.length)
        const { data: document, error } = await supabase
            .from('documents')
            .insert([
                {
                    bot_id: botId,
                    filename: file.name,
                    content: text,
                },
            ])
            .select()
            .single()

        if (error) {
            return Response.json({
                success: false,
                message: error.message,
            })
        }

        // Save chunks
        for (const chunk of chunks) {
            console.log("SAVING CHUNK...")

            const { error } = await supabase
                .from('document_chunks')
                .insert([
                    {
                        bot_id: botId,
                        filename: file.name, // Add this line
                        chunk_text: chunk,
                    },
                ])

            if (error) {
                console.log("CHUNK ERROR:", error)
            }
        }

        return Response.json({
            success: true,
            filename: file.name,
            chunks: chunks.length,
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message,
        })
    }
}