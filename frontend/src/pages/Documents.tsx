import React, { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';

const Documents: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');

  const documents = [
    {
      id: 1,
      title: 'صورتجلسه جلسه اول',
      titleEnglish: 'Minutes of First Meeting',
      type: 'meeting-minutes',
      size: '2.5 MB',
      date: '2024-01-10'
    },
    {
      id: 2,
      title: 'بودجه سال ۱۴۰۳',
      titleEnglish: '2024 Budget',
      type: 'document',
      size: '1.8 MB',
      date: '2024-01-08'
    }
  ];

  return (
    <div className={`${language === 'persian' ? 'rtl' : 'ltr'}`}>
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'persian' ? 'اسناد' : 'Documents'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {language === 'persian' ? 'اسناد و مدارک شورای شهر بانشی' : 'Documents of Baneshi city council'}
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
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <DocumentIcon className="h-8 w-8 text-primary-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {language === 'persian' ? doc.title : doc.titleEnglish}
                </h3>
                <p className="text-sm text-gray-500">{doc.date} • {doc.size}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
