import React, { useState } from 'react';
import { UsersIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Representatives: React.FC = () => {
  const [language, setLanguage] = useState<'persian' | 'english'>('persian');

  // Mock data for representatives
  const representatives = [
    {
      id: 1,
      name: 'احمد محمدی',
      nameEnglish: 'Ahmad Mohammadi',
      role: 'رئیس شورا',
      roleEnglish: 'Council Chairman',
      phone: '09123456789',
      email: 'ahmad@baneshi.ir',
      status: 'active'
    },
    {
      id: 2,
      name: 'فاطمه احمدی',
      nameEnglish: 'Fatemeh Ahmadi',
      role: 'نایب رئیس',
      roleEnglish: 'Vice Chairman',
      phone: '09123456788',
      email: 'fatemeh@baneshi.ir',
      status: 'active'
    },
    {
      id: 3,
      name: 'محمد رضایی',
      nameEnglish: 'Mohammad Rezaei',
      role: 'منشی',
      roleEnglish: 'Secretary',
      phone: '09123456787',
      email: 'mohammad@baneshi.ir',
      status: 'active'
    }
  ];

  return (
    <div className={`${language === 'persian' ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'persian' ? 'نمایندگان' : 'Representatives'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {language === 'persian' 
                ? 'مدیریت نمایندگان شورای شهر بانشی'
                : 'Manage representatives of Baneshi city council'
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
              {language === 'persian' ? 'افزودن نماینده' : 'Add Representative'}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'persian' ? 'جستجو در نمایندگان...' : 'Search representatives...'}
              className="form-input pl-10 w-full"
            />
          </div>
        </div>
        <select className="form-input w-full sm:w-48">
          <option value="">{language === 'persian' ? 'همه نقش‌ها' : 'All Roles'}</option>
          <option value="chairman">{language === 'persian' ? 'رئیس' : 'Chairman'}</option>
          <option value="vice-chairman">{language === 'persian' ? 'نایب رئیس' : 'Vice Chairman'}</option>
          <option value="secretary">{language === 'persian' ? 'منشی' : 'Secretary'}</option>
          <option value="member">{language === 'persian' ? 'عضو' : 'Member'}</option>
        </select>
      </div>

      {/* Representatives List */}
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {language === 'persian' ? 'لیست نمایندگان' : 'Representatives List'}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {representatives.map((rep) => (
              <div key={rep.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {language === 'persian' ? rep.name : rep.nameEnglish}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {language === 'persian' ? rep.role : rep.roleEnglish}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{rep.phone}</span>
                        <span>{rep.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${rep.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {rep.status === 'active' 
                        ? (language === 'persian' ? 'فعال' : 'Active')
                        : (language === 'persian' ? 'غیرفعال' : 'Inactive')
                      }
                    </span>
                    <button className="btn btn-secondary btn-sm">
                      {language === 'persian' ? 'ویرایش' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Representatives;
