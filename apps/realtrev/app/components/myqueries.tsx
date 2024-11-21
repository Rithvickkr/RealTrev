'use client'

import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import getTrevQuery from '../lib/actions/gettrevquery'
import { useRouter } from 'next/navigation'


type Query = {
    id: string;
    title: string;
    status: string;
    date: string;
    }


export default function MyQueriesPage(session: any) {
  const [queries, setQueries] = useState([] as Query[])
  const [filter, setFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()
  useEffect(() => {
    // Simulate fetching chats, replace this with your API call
    
   const fetchChats = async () => {
      const res = await getTrevQuery(session.session);
      if (Array.isArray(res)) {
        setQueries(res.map(chat => ({
            id: chat.id,
            title: chat.queryText, // Adjust this field based on your actual data
            status: chat.status,
            date: new Date(chat.createdAt).toLocaleDateString(), // Adjust this field based on your actual data
            })));
        console.log(res.length + " queries found");
      } else {
        setQueries([]);
      }
    };
    fetchChats();
  }, []);

  const filteredQueries = queries.filter(query => 
    (filter === 'All' || query.status === filter) &&
    query.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = queries.reduce((acc: { [key: string]: number }, query) => {
    acc[query.status] = (acc[query.status] || 0) + 1
    return acc
  }, {})

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-sky-50 text-slate-900'}`}>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-14">
            <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">My Queries</h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleDarkMode}
                className="bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-slate-700 dark:text-amber-400 dark:hover:bg-slate-600"
              >
                {darkMode ? '🌞' : '🌙'}
              </Button>
              <Select onValueChange={setFilter} defaultValue="All">
                <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800">
                  <SelectValue placeholder="Filter queries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Queries</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>
  
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-sm text-slate-600 dark:text-slate-300">
              <Badge  variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-100 cursor-pointer">{stats.PENDING || 0} PENDING</Badge>
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100 cursor-pointer">{stats.ACCEPTED || 0} Accepted</Badge>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100 cursor-pointer">{stats.RESOLVED || 0} Resolved</Badge>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search queries..."
                className="pl-8 bg-white dark:bg-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
  
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredQueries.map(query => (
              <Card key={query.id} className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} overflow-hidden transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <Link href={`/query/${query.id}`} className="hover:underline text-teal-600 dark:text-teal-400">
                        {query.title}
                      </Link>
                    </CardTitle>
                    <Badge 
                      variant={query.status === 'PENDING' ? 'secondary' : query.status === 'ACCEPTED' ? 'default' : 'outline'}
                      className={`
                        ${query.status === 'PENDING' ? 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-100' : ''}
                        ${query.status === 'ACCEPTED' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-100' : ''}
                        ${query.status === 'RESOLVED' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100' : ''}
                      `}
                    >
                      {query.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Submitted on {query.date}</p>
                  
                </CardContent>
                <CardFooter className="flex justify-between">
                  {query.status === 'PENDING' && (
                    <>
                      <Button variant="outline" size="sm" className="text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900">Edit</Button>
                      <Button variant="destructive" size="sm" className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800">Cancel</Button>
                    </>
                  )}
                  {query.status === "ACCEPTED" && (
                    <Button type="button" onClick={() => router.push(`/chatpage/${query.id}`)} className="w-full bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" /> Open Chat
                    </Button>
                  )}
                  {query.status === 'RESOLVED' && (
                    <>
                      <Button variant="outline" size="sm" className="text-amber-600 dark:text-amber-400 border-amber-600 dark:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900">View Details</Button>
                      <Button variant="secondary" size="sm" className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800">Leave Feedback</Button>
                    </>
                  )}
                </CardFooter>
                {query.status === 'ACCEPTED' && (
                  <div className="absolute top-0 right-0 m-2">
                    <Badge variant="destructive" className="animate-pulse bg-teal-500 hover:bg-teal-600">
                      <Bell className="mr-1 h-3 w-3" /> Chat Now
                    </Badge>
                  </div>
                )}
              </Card>
            ))}
          </div>
  
          {filteredQueries.length === 0 && (
            <p className="text-center mt-8 text-slate-600 dark:text-slate-300">No queries found. Try adjusting your filters or search term.</p>
          )}
  
          {/* <div className="mt-8 flex justify-center">
            <Button variant="outline" className="text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900">Load More</Button>
          </div> */}
        </div>
      </div>
    )
  }