
import React, { useState } from 'react';
import { User, LinkedInTrackerData, LinkedInStatus } from '../types';
import { MONTHS, STATUS_OPTIONS, DOMAIN_HIERARCHY } from '../constants';
import { storageService } from '../services/storageService';

interface PostTrackerProps {
  user: User;
}

const PostTracker: React.FC<PostTrackerProps> = ({ user }) => {
  const [data, setData] = useState<LinkedInTrackerData>(storageService.getLinkedInData());
  const [currentMonth, setCurrentMonth] = useState(MONTHS[new Date().getMonth()]);
  
  const subDomainsToDisplay = user.role === 'Head' 
    ? Object.values(DOMAIN_HIERARCHY).flat() 
    : [user.subDomain];

  const updateStatus = (sd: string, month: string, analyst: string, field: keyof LinkedInStatus, value: string) => {
    const newData = { ...data };
    if (!newData[sd]) newData[sd] = {};
    if (!newData[sd][month]) newData[sd][month] = {};
    if (!newData[sd][month][analyst]) newData[sd][month][analyst] = { individual: '', subdomain: '' };
    
    newData[sd][month][analyst][field] = value;
    setData(newData);
    storageService.saveLinkedInData(newData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">LinkedIn Post Tracker</h2>
          <p className="text-xs text-slate-500">Target: 1 Individual + 1 Sub-domain Post Monthly</p>
        </div>
        <select 
          value={currentMonth} 
          onChange={(e) => setCurrentMonth(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80">
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600 w-1/4">Sub-Domain</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Analyst Name</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Individual Post</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Sub-Domain Post</th>
            </tr>
          </thead>
          <tbody>
            {subDomainsToDisplay.map((sd) => {
              const monthData = data[sd]?.[currentMonth] || {};
              const analysts = Object.keys(monthData);
              if (user.role !== 'Head' && !analysts.includes(user.name)) {
                analysts.push(user.name);
              }
              
              return analysts.map((analyst, idx) => {
                const status = monthData[analyst] || { individual: '', subdomain: '' };
                return (
                  <tr key={`${sd}-${analyst}`} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <td className="p-4 font-medium text-slate-700">{idx === 0 ? sd : ''}</td>
                    <td className="p-4 text-slate-600 font-semibold">{analyst}</td>
                    <td className="p-4">
                      <select
                        value={status.individual}
                        onChange={(e) => updateStatus(sd, currentMonth, analyst, 'individual', e.target.value)}
                        className={`w-full p-2 rounded-lg border text-sm transition-all outline-none ${
                          status.individual === 'Completed' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-white border-slate-300'
                        }`}
                      >
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || 'Select status...'}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={status.subdomain}
                        onChange={(e) => updateStatus(sd, currentMonth, analyst, 'subdomain', e.target.value)}
                        className={`w-full p-2 rounded-lg border text-sm transition-all outline-none ${
                          status.subdomain === 'Completed' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-slate-300'
                        }`}
                      >
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || 'Select status...'}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostTracker;
