import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  MoreHorizontal,
  Plus
} from 'lucide-react';

interface Stats {
  totalLeads: number;
  statusStats?: Array<{ _id: string; count: number }>;
  conversionStats?: {
    conversionRate: number;
    totalValue: number;
  };
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  priority: string;
  leadId?: string;
  user?: {
    _id: string;
    name: string;
  };
}

interface OverviewProps {
  stats: Stats;
  user: any;
  activities: Activity[];
}

// Mock data only for demo purposes - will be replaced with real data
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

const Overview = ({ stats, user, activities }: OverviewProps) => {
  const conversion = stats?.conversionStats?.conversionRate || 0;
  const totalValue = stats?.conversionStats?.totalValue || 0;
  
  // Calculate additional metrics
  const activeLeads = stats?.statusStats?.find(s => ['new', 'contacted', 'qualified'].includes(s._id))?.count || 0;

  // Use real activities if available, otherwise fallback to mock data for empty states
  const displayActivities = activities.length > 0 ? activities : recentActivities;
  
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-2xl p-4 lg:p-6 shadow-lg border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white">
              Willkommen zurück, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h2>
            <p className="text-slate-200 mb-4">
              Hier ist eine Übersicht über Ihre heutige Performance
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>7 neue Leads heute</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>3 Termine anstehend</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:block">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm">
              <Plus className="h-4 w-4 mr-2" />
              Neuer Lead
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gesamt Leads</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalLeads || 0}</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="text-sm text-gray-500 ml-1 hidden sm:inline">vs. letzter Monat</span>
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
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">{conversion.toFixed(1)}%</div>
            <div className="flex items-center mt-2">
              <Progress value={conversion} className="flex-1 h-2" />
              <span className="text-sm text-gray-500 ml-2 hidden sm:inline">Ziel: 25%</span>
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
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">€{(totalValue || 0).toLocaleString()}</div>
            <div className="flex items-center mt-2">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="text-sm text-gray-500 ml-1 hidden sm:inline">vs. Vormonat</span>
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
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">{activeLeads}</div>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">Benötigen Aufmerksamkeit</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 lg:space-y-4">
            {displayActivities.length > 0 ? (
              displayActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                      <span className="text-sm text-gray-500 mt-1 sm:mt-0 shrink-0">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    {(activity as Activity).user && (
                      <p className="text-xs text-gray-500 mt-1">von {(activity as Activity).user!.name}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Noch keine Aktivitäten vorhanden</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            <Button variant="outline" className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
              <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs lg:text-sm">Neuer Lead</span>
            </Button>
            <Button variant="outline" className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs lg:text-sm">Termin planen</span>
            </Button>
            <Button variant="outline" className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
              <Users className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs lg:text-sm">Kontakt hinzufügen</span>
            </Button>
            <Button variant="outline" className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
              <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs lg:text-sm">Bericht erstellen</span>
            </Button>
            <Button variant="outline" className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
              <Star className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs lg:text-sm">Kampagne starten</span>
            </Button>
            <Button variant="outline" className="h-16 lg:h-20 flex flex-col items-center justify-center space-y-1 lg:space-y-2">
              <MoreHorizontal className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="text-xs lg:text-sm">Mehr</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
