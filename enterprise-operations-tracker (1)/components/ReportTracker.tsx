
import React, { useState } from 'react';
import { User, ReportTrackerData, ReportStatus } from '../types';
import { MONTHS, REPORT_STATUS_OPTIONS, DOMAIN_HIERARCHY } from '../constants';
import { storageService } from '../services/storageService';

interface ReportTrackerProps {
  user: User;
}

const ReportTracker: React.FC<ReportTrackerProps> = ({ user }) => {
  const [data, setData] = useState<ReportTrackerData>(storageService.getReportData());
  const [currentMonth, setCurrentMonth] = useState(MONTHS[new Date().getMonth()]);
  const currentYear = new Date().getFullYear().toString();

  const subDomainsToDisplay = user.role === 'Head' 
    ? Object.values(DOMAIN_HIERARCHY).flat() 
    : [user.subDomain];

  const updateReport = (sd: string, month: string, analyst: string, field: keyof ReportStatus, value: string) => {
    const newData = { ...data };
    if (!newData[sd]) newData[sd] = {};
    if (!newData[sd][currentYear]) newData[sd][currentYear] = {};
    if (!newData[sd][currentYear][month]) newData[sd][currentYear][month] = {};
    if (!newData[sd][currentYear][month][analyst]) newData[sd][currentYear][month][analyst] = { qir: '', qbr: '', mir: '' };
    
    newData[sd][currentYear][month][analyst][field] = value;
    setData(newData);
    storageService.saveReportData(newData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">QIR / QBR / MIR Tracker</h2>
          <p className="text-xs text-slate-500">Quarterly Insight, Quarterly Business, Monthly Insight Reports</p>
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
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Sub-Domain</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">Analyst</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">MIR (Monthly)</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">QIR (Quarterly)</th>
              <th className="p-4 border-b border-slate-200 font-bold text-slate-600">QBR (Quarterly)</th>
            </tr>
          </thead>
          <tbody>
            {subDomainsToDisplay.map((sd) => {
              const monthData = data[sd]?.[currentYear]?.[currentMonth] || {};
              const analysts = Object.keys(monthData);
              if (user.role !== 'Head' && !analysts.includes(user.name)) {
                analysts.push(user.name);
              }
              
              return analysts.map((analyst, idx) => {
                const status = monthData[analyst] || { qir: '', qbr: '', mir: '' };

                return (
                  <tr key={`${sd}-${analyst}`} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <td className="p-4 font-medium text-slate-700">{idx === 0 ? sd : ''}</td>
                    <td className="p-4 text-slate-600 font-semibold">{analyst}</td>
                    <td className="p-4">
                      <select
                        value={status.mir}
                        onChange={(e) => updateReport(sd, currentMonth, analyst, 'mir', e.target.value)}
                        className={`w-full p-2 rounded-lg border text-sm outline-none transition-all ${
                          status.mir === 'Sent' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 
                          status.mir === 'Finalised' ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold' : 'bg-white border-slate-300'
                        }`}
                      >
                        {REPORT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || 'Select status...'}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={status.qir}
                        onChange={(e) => updateReport(sd, currentMonth, analyst, 'qir', e.target.value)}
                        className={`w-full p-2 rounded-lg border text-sm outline-none transition-all ${
                          status.qir === 'Sent' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 
                          status.qir === 'Finalised' ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold' : 'bg-white border-slate-300'
                        }`}
                      >
                        {REPORT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || 'Select status...'}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={status.qbr}
                        onChange={(e) => updateReport(sd, currentMonth, analyst, 'qbr', e.target.value)}
                        className={`w-full p-2 rounded-lg border text-sm outline-none transition-all ${
                          status.qbr === 'Sent' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 
                          status.qbr === 'Finalised' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' : 'bg-white border-slate-300'
                        }`}
                      >
                        {REPORT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt || 'Select status...'}</option>)}
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

export default ReportTracker;
