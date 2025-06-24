import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, TrendingUp, Calendar } from 'lucide-react';

interface Stats {
  totalLeads: number;
  statusStats?: Array<{ _id: string; count: number }>;
  conversionStats?: {
    conversionRate: number;
    totalValue: number;
  };
}

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Gesamt Leads</CardTitle>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Users className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{stats.totalLeads || 0}</div>
          <p className="text-xs text-blue-700 mt-1">Alle registrierten Leads</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Gewonnene Leads</CardTitle>
          <div className="bg-green-600 p-2 rounded-lg">
            <Target className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">
            {stats.statusStats?.find(s => s._id === 'closed-won')?.count || 0}
          </div>
          <p className="text-xs text-green-700 mt-1">Erfolgreich abgeschlossen</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">Conversion Rate</CardTitle>
          <div className="bg-purple-600 p-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900">
            {stats.conversionStats?.conversionRate?.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-purple-700 mt-1">Lead zu Kunde Rate</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-900">Gesamt Wert</CardTitle>
          <div className="bg-orange-600 p-2 rounded-lg">
            <Calendar className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-900">
            €{stats.conversionStats?.totalValue?.toLocaleString('de-DE') || 0}
          </div>
          <p className="text-xs text-orange-700 mt-1">Gesamter Lead-Wert</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
