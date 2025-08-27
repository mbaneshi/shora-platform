import React, { useState } from 'react';
import { DocumentTextIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Decisions: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');

  const decisions = [
    {
      id: 1,
      title: 'تصویب بودجه سال ۱۴۰۳',
      titleEnglish: 'Approval of 2024 Budget',
      status: 'approved',
      date: '2024-01-10',
      votes: { yes: 5, no: 1, abstain: 1 }
    },
    {
      id: 2,
      title: 'احداث پارک جدید در مرکز شهر',
      titleEnglish: 'Construction of New Park in City Center',
      status: 'proposed',
      date: '2024-01-15',
      votes: { yes: 3, no: 2, abstain: 2 }
    }
  ];

  const getStatusText = (status: string) => {
    if (language === 'persian') {
      switch (status) {
        case 'approved': return 'تصویب شده';
        case 'rejected': return 'رد شده';
        case 'proposed': return 'پیشنهاد شده';
        default: return status;
      }
    } else {
      switch (status) {
        case 'approved': return 'Approved';
        case 'rejected': return 'Rejected';
        case 'proposed': return 'Proposed';
        default: return status;
      }
    }
  };

  return (
    <div className={`${language === 'persian' ? 'rtl' : 'ltr'}`}>
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'persian' ? 'تصمیمات' : 'Decisions'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {language === 'persian' ? 'تصمیمات شورای شهر بانشی' : 'Decisions of Baneshi city council'}
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

      <div className="mt-6 space-y-4">
        {decisions.map((decision) => (
          <div key={decision.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DocumentTextIcon className="h-8 w-8 text-primary-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language === 'persian' ? decision.title : decision.titleEnglish}
                  </h3>
                  <p className="text-sm text-gray-500">{decision.date}</p>
                </div>
              </div>
              <span className={`badge ${decision.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                {getStatusText(decision.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Decisions;
