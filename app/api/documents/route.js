import supabase from '@/app/lib/supabase'

export async function POST(req) {
    try {
        const { botId } = await req.json()

        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('bot_id', botId)
            .order('created_at', {
                ascending: false,
            })

        if (error) {
            return Response.json({
                success: false,
                message: error.message,
            })
        }

        return Response.json({
            success: true,
            documents: data,
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: error.message,
        })
    }
}