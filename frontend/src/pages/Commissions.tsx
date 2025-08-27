import React, { useState } from 'react';
import { UserGroupIcon, PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

const Commissions: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');

  // Mock data for commissions
  const commissions = [
    {
      id: 1,
      name: 'کمیسیون زیرساخت',
      nameEnglish: 'Infrastructure Commission',
      type: 'standing',
      members: 5,
      nextMeeting: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'کمیسیون آموزش',
      nameEnglish: 'Education Commission',
      type: 'standing',
      members: 4,
      nextMeeting: '2024-01-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'کمیسیون بهداشت',
      nameEnglish: 'Health Commission',
      type: 'standing',
      members: 3,
      nextMeeting: '2024-01-25',
      status: 'active'
    }
  ];

  const getTypeText = (type: string) => {
    if (language === 'persian') {
      switch (type) {
        case 'standing': return 'دائمی';
        case 'ad-hoc': return 'موقت';
        case 'special': return 'ویژه';
        default: return type;
      }
    } else {
      switch (type) {
        case 'standing': return 'Standing';
        case 'ad-hoc': return 'Ad-hoc';
        case 'special': return 'Special';
        default: return type;
      }
    }
  };

  return (
    <div className={`${language === 'persian' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'persian' ? 'کمیسیون‌ها' : 'Commissions'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {language === 'persian' 
                ? 'مدیریت کمیسیون‌های شورای شهر بانشی'
                : 'Manage commissions of Baneshi city council'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLanguage(language === 'persian' ? 'english' : 'persian')}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
            >
              <span className="mr-2">
                {language === 'persian' ? '🇺🇸 English' : '🇮🇷 فارسی'}
              </span>
            </button>
            <button className="btn btn-primary flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              {language === 'persian' ? 'افزودن کمیسیون' : 'Add Commission'}
            </button>
          </div>
        </div>
      </div>

      {/* Commissions Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commissions.map((commission) => (
          <div key={commission.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-primary-600" />
                </div>
                <span className={`badge ${commission.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {commission.status === 'active' 
                    ? (language === 'persian' ? 'فعال' : 'Active')
                    : (language === 'persian' ? 'غیرفعال' : 'Inactive')
                  }
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'persian' ? commission.name : commission.nameEnglish}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>{language === 'persian' ? 'نوع:' : 'Type:'}</span>
                  <span className="font-medium">{getTypeText(commission.type)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{language === 'persian' ? 'اعضا:' : 'Members:'}</span>
                  <span className="font-medium">{commission.members}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{language === 'persian' ? 'جلسه بعدی:' : 'Next Meeting:'}</span>
                  <span className="font-medium">{commission.nextMeeting}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="btn btn-secondary btn-sm flex-1">
                  {language === 'persian' ? 'مشاهده' : 'View'}
                </button>
                <button className="btn btn-outline btn-sm">
                  {language === 'persian' ? 'ویرایش' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Commissions;
