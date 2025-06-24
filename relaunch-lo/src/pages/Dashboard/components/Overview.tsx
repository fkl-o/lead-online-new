import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Activity,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  Eye
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Stats {
  totalLeads: number;
  statusStats?: Array<{ _id: string; count: number }>;
  conversionStats?: {
    conversionRate: number;
    totalValue: number;
  };
}

interface OverviewProps {
  stats: Stats;
  user: any;
}

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 4000, leads: 240, target: 4500 },
  { month: 'Feb', revenue: 3000, leads: 198, target: 4500 },
  { month: 'Mar', revenue: 5000, leads: 300, target: 4500 },
  { month: 'Apr', revenue: 4500, leads: 278, target: 4500 },
  { month: 'Mai', revenue: 6000, leads: 345, target: 4500 },
  { month: 'Jun', revenue: 5500, leads: 312, target: 4500 },
];

const leadSourceData = [
  { name: 'Website', value: 400, color: '#be123c' },
  { name: 'E-Mail Marketing', value: 300, color: '#060b23' },
  { name: 'Social Media', value: 200, color: '#3b82f6' },
  { name: 'Empfehlungen', value: 150, color: '#10b981' },
  { name: 'Sonstige', value: 100, color: '#8b5cf6' },
];

const activityData = [
  { time: '00:00', calls: 12, emails: 23, meetings: 5 },
  { time: '04:00', calls: 18, emails: 35, meetings: 8 },
  { time: '08:00', calls: 32, emails: 67, meetings: 15 },
  { time: '12:00', calls: 45, emails: 89, meetings: 22 },
  { time: '16:00', calls: 38, emails: 72, meetings: 18 },
  { time: '20:00', calls: 25, emails: 45, meetings: 10 },
];

const recentActivities = [
  {
    id: 1,
    type: 'lead',
    title: 'Neuer Lead erhalten',
    description: 'Max Mustermann - Website Anfrage',
    time: '2 Min.',
    priority: 'high'
  },
  {
    id: 2,
    type: 'meeting',
    title: 'Meeting abgeschlossen',
    description: 'Beratungsgespräch mit ABC GmbH',
    time: '15 Min.',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'email',
    title: 'E-Mail versendet',
    description: 'Follow-up an 5 Leads',
    time: '1 Std.',
    priority: 'low'
  },
  {
    id: 4,
    type: 'deal',
    title: 'Deal gewonnen',
    description: 'XYZ Corp - €15,000',
    time: '2 Std.',
    priority: 'high'
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Follow-up Call mit TechStart GmbH',
    time: '14:00',
    type: 'call',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Proposal für Digital Solutions',
    time: '16:30',
    type: 'document',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Team Meeting - Wochenbericht',
    time: '17:00',
    type: 'meeting',
    priority: 'low'
  }
];

const Overview = ({ stats, user }: OverviewProps) => {
  const [timeRange, setTimeRange] = useState('30d');
  
  const isAdmin = user?.role === 'admin';
  const conversion = stats?.conversionStats?.conversionRate || 0;
  const totalValue = stats?.conversionStats?.totalValue || 0;
  
  // Calculate additional metrics
  const activeLeads = stats?.statusStats?.find(s => ['new', 'contacted', 'qualified'].includes(s._id))?.count || 0;
  const wonLeads = stats?.statusStats?.find(s => s._id === 'closed-won')?.count || 0;
  
  return (
    <div className="space-y-6">      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              Willkommen zurück, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h2>
            <p className="text-slate-200 mb-4">
              Hier ist eine Übersicht über Ihre heutige Performance
            </p>            <div className="flex items-center space-x-6 text-sm text-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>7 neue Leads heute</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>3 Termine anstehend</span>
              </div>
            </div>
          </div>          <div className="hidden md:block">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
              <Plus className="h-4 w-4 mr-2" />
              Neuer Lead
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gesamt Leads</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalLeads || 0}</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500 ml-1">vs. letzter Monat</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{conversion.toFixed(1)}%</div>
            <div className="flex items-center mt-2">
              <Progress value={conversion} className="flex-1 h-2" />
              <span className="text-sm text-gray-500 ml-2">Ziel: 25%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Umsatz (Monat)</CardTitle>
            <div className="bg-purple-100 p-2 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">€{(totalValue || 0).toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="text-sm text-gray-500 ml-1">vs. Vormonat</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktive Leads</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Activity className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{activeLeads}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">Benötigen Aufmerksamkeit</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Umsatz & Leads</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">30T</Button>
                <Button variant="outline" size="sm">90T</Button>
                <Button variant="default" size="sm">6M</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#be123c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#be123c" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `€${value?.toLocaleString()}` : value,
                    name === 'revenue' ? 'Umsatz' : name === 'leads' ? 'Leads' : 'Ziel'
                  ]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#be123c" fillOpacity={1} fill="url(#colorRevenue)" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Lead Quellen</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Alle anzeigen
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Anstehende Aufgaben</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority === 'high' ? 'Hoch' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">{task.time}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Neue Aufgabe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Neuer Lead</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Termin planen</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Kontakt hinzufügen</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Bericht erstellen</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Star className="h-5 w-5" />
              <span className="text-sm">Kampagne starten</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-sm">Mehr</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
