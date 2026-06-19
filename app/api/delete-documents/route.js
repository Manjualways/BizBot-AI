import supabase from '@/app/lib/supabase'

export async function POST(req) {
    try {
        const { documentId } = await req.json()

        // Find the document first
        const { data: document, error: fetchError } =
            await supabase
                .from('documents')
                .select('*')
                .eq('id', documentId)
                .single()

        if (fetchError || !document) {
            return Response.json({
                success: false,
                message: 'Document not found',
            })
        }

        // Delete the document
        const { error: deleteError } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId)

        if (deleteError) {
            return Response.json({
                success: false,
                message: deleteError.message,
            })
        }

        // Delete all chunks belonging to this document
        const { error: chunkError } = await supabase
            .from('document_chunks')
            .delete()
            .eq('bot_id', document.bot_id)
            .eq('filename', document.filename)

        if (chunkError) {
            return Response.json({
                success: false,
                message: chunkError.message,
            })
        }

        return Response.json({
            success: true,
            message: 'Document deleted successfully',
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message,
        })
    }
}