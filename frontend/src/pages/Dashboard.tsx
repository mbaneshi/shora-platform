import React, { useState } from 'react';
import { 
  UsersIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  FolderIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');
  
  // Mock data for demonstration
  const stats = [
    {
      name: 'Total Representatives',
      namePersian: 'کل نمایندگان',
      value: '7',
      change: '+2',
      changeType: 'increase',
      icon: UsersIcon,
      description: '5 main + 2 alternate',
      descriptionPersian: '۵ اصلی + ۲ جانشین'
    },
    {
      name: 'Active Commissions',
      namePersian: 'کمیسیون‌های فعال',
      value: '4',
      change: '+1',
      changeType: 'increase',
      icon: UserGroupIcon,
      description: 'Working groups',
      descriptionPersian: 'گروه‌های کاری'
    },
    {
      name: 'Recent Decisions',
      namePersian: 'تصمیمات اخیر',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: DocumentTextIcon,
      description: 'This month',
      descriptionPersian: 'این ماه'
    },
    {
      name: 'Documents',
      namePersian: 'اسناد',
      value: '45',
      change: '+8',
      changeType: 'increase',
      icon: FolderIcon,
      description: 'Total files',
      descriptionPersian: 'کل فایل‌ها'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'decision',
      title: 'Approval of new community center',
      description: 'The council approved the construction of a new community center in the northern district.',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: 2,
      type: 'meeting',
      title: 'Monthly council meeting',
      description: 'Regular monthly meeting to discuss ongoing projects and community concerns.',
      date: '2024-01-20',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'commission',
      title: 'Education commission report',
      description: 'The education commission submitted their quarterly report on school improvements.',
      date: '2024-01-18',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-success-600 bg-success-50';
      case 'scheduled':
        return 'text-warning-600 bg-warning-50';
      case 'completed':
        return 'text-primary-600 bg-primary-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />;
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-warning-600" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-primary-600" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'persian' ? 'داشبورد' : 'Dashboard'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {language === 'persian' 
                ? 'به پلتفرم شورا برای شهر بانشی خوش آمدید. اینجا نمای کلی از فعالیت‌های فعلی و آمار است.'
                : 'Welcome to the Shora Platform for Baneshi city. Here\'s an overview of current activities and statistics.'
              }
            </p>
          </div>
          <button
            onClick={() => setLanguage(language === 'persian' ? 'english' : 'persian')}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
          >
            <span className="mr-2">
              {language === 'persian' ? '🇺🇸 English' : '🇮🇷 فارسی'}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card card-hover p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">
                  {language === 'persian' ? stat.namePersian : stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 text-sm font-medium text-success-600">{stat.change}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {language === 'persian' ? stat.descriptionPersian : stat.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
          <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs text-gray-500 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card card-hover p-6 text-center">
          <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <DocumentTextIcon className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Create Decision</h3>
          <p className="text-sm text-gray-600 mb-4">Document a new council decision or resolution</p>
          <button className="btn btn-primary w-full">New Decision</button>
        </div>

        <div className="card card-hover p-6 text-center">
          <div className="mx-auto h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
            <CalendarIcon className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Meeting</h3>
          <p className="text-sm text-gray-600 mb-4">Set up a new council or commission meeting</p>
          <button className="btn btn-success w-full">Schedule Meeting</button>
        </div>

        <div className="card card-hover p-6 text-center">
          <div className="mx-auto h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
            <FolderIcon className="h-6 w-6 text-warning-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Document</h3>
          <p className="text-sm text-gray-600 mb-4">Add new documents to the platform</p>
          <button className="btn btn-warning w-full">Upload Document</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
