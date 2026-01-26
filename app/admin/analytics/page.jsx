"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, MousePointerClick, Instagram, Search, Filter, Copy, Download } from "lucide-react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [excludeLocalhost, setExcludeLocalhost] = useState(true); // Default to excluding localhost

  useEffect(() => {
    loadAnalytics();
  }, [dateRange, excludeLocalhost]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Use environment variable or fallback to production URL
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aitrendpromt.onrender.com';
      
      const endDate = new Date().toISOString();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));
      const startDateStr = startDate.toISOString();

      const excludeLocalhostParam = excludeLocalhost ? '&excludeLocalhost=true' : '';
      const response = await fetch(
        `${API_URL}/api/analytics/stats?startDate=${startDateStr}&endDate=${endDate}${excludeLocalhostParam}`
      );
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'page_view': return <Users className="w-5 h-5" />;
      case 'prompt_click': return <MousePointerClick className="w-5 h-5" />;
      case 'instagram_click': return <Instagram className="w-5 h-5" />;
      case 'search': return <Search className="w-5 h-5" />;
      case 'filter_apply': return <Filter className="w-5 h-5" />;
      case 'copy_prompt': return <Copy className="w-5 h-5" />;
      case 'download_image': return <Download className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeLocalhost}
                onChange={(e) => setExcludeLocalhost(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Exclude Localhost</span>
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <a
              href="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Admin
            </a>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents?.toLocaleString() || 0}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.eventsByType?.find(e => e._id === 'page_view')?.count?.toLocaleString() || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prompt Clicks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.eventsByType?.find(e => e._id === 'prompt_click')?.count?.toLocaleString() || 0}
                </p>
              </div>
              <MousePointerClick className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Instagram Clicks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.eventsByType?.find(e => e._id === 'instagram_click')?.count?.toLocaleString() || 0}
                </p>
              </div>
              <Instagram className="w-12 h-12 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Type */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Events by Type</h2>
            <div className="space-y-3">
              {stats.eventsByType?.map((event) => (
                <div key={event._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event._id)}
                    <span className="font-medium text-gray-900 capitalize">
                      {event._id.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{event.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pages */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Pages</h2>
            <div className="space-y-3">
              {stats.pageViews?.map((page, index) => (
                <div key={page._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                    <span className="font-medium text-gray-900">{page._id || 'Home'}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{page.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Prompts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Most Clicked Prompts</h2>
            <div className="space-y-3">
              {stats.topPrompts?.map((prompt, index) => (
                <div key={prompt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      #{index + 1} {prompt.title || prompt._id}
                    </p>
                    <p className="text-xs text-gray-500">{prompt._id}</p>
                  </div>
                  <span className="text-lg font-bold text-purple-600 ml-4">{prompt.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instagram Clicks by Location */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Instagram Clicks by Location</h2>
            <div className="space-y-3">
              {stats.instagramClicks?.map((click) => (
                <div key={click._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <span className="font-medium text-gray-900 capitalize">
                      {click._id?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-pink-600">{click.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Referrers */}
        {stats.topReferrers && stats.topReferrers.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Referrers</h2>
            <div className="space-y-3">
              {stats.topReferrers.map((referrer, index) => (
                <div key={referrer._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                    <span className="font-medium text-gray-900 truncate">{referrer._id || 'Direct'}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 ml-4">{referrer.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Stats Chart */}
        {stats.dailyStats && stats.dailyStats.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Activity (Last 30 Days)</h2>
            <div className="space-y-2">
              {stats.dailyStats.map((day) => {
                const maxCount = Math.max(...stats.dailyStats.map(d => d.count));
                const percentage = (day.count / maxCount) * 100;
                return (
                  <div key={day._id} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 w-24">{day._id}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-bold text-white">{day.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

