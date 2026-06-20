
'use client'

import { useEffect, useState } from 'react'
import supabase from '@/app/lib/supabase'

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true)

    const [stats, setStats] = useState({
        chatbots: 0,
        documents: 0,
        messages: 0,
        todayMessages: 0,
    })

    const [recentQuestions, setRecentQuestions] =
        useState([])

    const [chartData, setChartData] = useState([])
    const [topBots, setTopBots] = useState([])

    useEffect(() => {
        loadAnalytics()
    }, [])

    const loadAnalytics = async () => {
        try {
            setLoading(true)
            const { data: bots } =
                await supabase
                    .from('chatbots')
                    .select('*')

            const botStats = []

            for (const bot of bots || []) {

                const { count } =
                    await supabase
                        .from('messages')
                        .select('*', {
                            count: 'exact',
                            head: true,
                        })
                        .eq('bot_id', bot.id)

                botStats.push({
                    ...bot,
                    message_count: count || 0,
                })
            }

            botStats.sort(
                (a, b) =>
                    b.message_count -
                    a.message_count
            )

            setTopBots(
                botStats.slice(0, 5)
            )

            // Chatbots count
            const { count: chatbotCount } =
                await supabase
                    .from('chatbots')
                    .select('*', {
                        count: 'exact',
                        head: true,
                    })

            // Documents count
            const { count: documentCount } =
                await supabase
                    .from('documents')
                    .select('*', {
                        count: 'exact',
                        head: true,
                    })

            // Messages count
            const { count: messageCount } =
                await supabase
                    .from('messages')
                    .select('*', {
                        count: 'exact',
                        head: true,
                    })

            // Today's messages
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const { count: todayCount } =
                await supabase
                    .from('messages')
                    .select('*', {
                        count: 'exact',
                        head: true,
                    })
                    .gte(
                        'created_at',
                        today.toISOString()
                    )

            setStats({
                chatbots: chatbotCount || 0,
                documents: documentCount || 0,
                messages: messageCount || 0,
                todayMessages: todayCount || 0,
            })

            // Recent user questions
            const { data: questions } =
                await supabase
                    .from('messages')
                    .select('content')
                    .eq('role', 'user')
                    .order('created_at', {
                        ascending: false,
                    })
                    .limit(10)

            setRecentQuestions(
                questions || []
            )

            // Last 7 days chart
            const chart = []

            for (let i = 6; i >= 0; i--) {
                const start = new Date()
                start.setDate(
                    start.getDate() - i
                )
                start.setHours(0, 0, 0, 0)

                const end = new Date(start)
                end.setHours(
                    23,
                    59,
                    59,
                    999
                )

                const { count } =
                    await supabase
                        .from('messages')
                        .select('*', {
                            count: 'exact',
                            head: true,
                        })
                        .gte(
                            'created_at',
                            start.toISOString()
                        )
                        .lte(
                            'created_at',
                            end.toISOString()
                        )

                chart.push({
                    day: start.toLocaleDateString(
                        'en-US',
                        {
                            weekday: 'short',
                        }
                    ),
                    messages: count || 0,
                })
            }

            setChartData(chart)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="p-10">
                Loading analytics...
            </div>
        )
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">

            <h1 className="text-4xl font-bold mb-8">
                📊 Analytics Dashboard
            </h1>

            {/* Cards */}

            <div className="grid md:grid-cols-5 gap-6 mb-8">

                <div className="bg-white p-6 rounded-3xl shadow">
                    <p className="text-gray-500">
                        Chatbots
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {stats.chatbots}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                    <p className="text-gray-500">
                        Documents
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {stats.documents}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                    <p className="text-gray-500">
                        Messages
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {stats.messages}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow">
                    <p className="text-gray-500">
                        Today
                    </p>
                    <div className="bg-green-50 p-6 rounded-3xl shadow">

                        <p className="text-green-600">
                            Growth
                        </p>

                        <h2 className="text-4xl font-bold">
                            +24%
                        </h2>

                    </div>
                    <h2 className="text-4xl font-bold mt-3">
                        {stats.todayMessages}
                    </h2>
                </div>

            </div>

            {/* Chart */}

            <div className="bg-white p-6 rounded-3xl shadow mb-8">

                <h2 className="text-2xl font-bold mb-6">
                    Messages Last 7 Days
                </h2>

                <div className="h-80">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <BarChart data={chartData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="messages" />
                        </BarChart>
                    </ResponsiveContainer>

                </div>

            </div>

            {/* Recent Questions */}

            <div className="bg-white p-6 rounded-3xl shadow">

                <h2 className="text-2xl font-bold mb-6">
                    Recent Questions
                </h2>

                <div className="space-y-3">

                    {recentQuestions.length === 0 ? (
                        <p className="text-gray-500">
                            No questions yet
                        </p>
                    ) : (
                        recentQuestions.map(
                            (question, index) => (
                                <div
                                    key={index}
                                    className="border rounded-xl p-4"
                                >
                                    {question.content}
                                </div>
                            )
                        )
                    )}

                </div>

            </div>

            {/* topBots */}

            <div className="bg-white p-6 rounded-3xl shadow mt-8">

                <h2 className="text-2xl font-bold mb-6">
                    🏆 Top Chatbots
                </h2>

                {topBots.map((bot, index) => (
                    <div
                        key={bot.id}
                        className="flex justify-between items-center border-b py-3"
                    >
                        <div>
                            <p className="font-semibold">
                                #{index + 1} {bot.name}
                            </p>
                        </div>

                        <p>
                            {bot.message_count} messages
                        </p>
                    </div>
                ))}

            </div>

        </div>
    )
}
