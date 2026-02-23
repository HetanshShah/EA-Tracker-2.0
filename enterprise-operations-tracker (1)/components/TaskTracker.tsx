
import React, { useState } from 'react';
import { User, WeeklyTaskData } from '../types';
import { MONTHS, WEEKS } from '../constants';
import { storageService } from '../services/storageService';

interface TaskTrackerProps {
  user: User;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ user }) => {
  const [data, setData] = useState<WeeklyTaskData>(storageService.getTaskData());
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [viewingUser, setViewingUser] = useState(user.name);

  const updateTask = (week: string, category: string, value: string) => {
    const newData = { ...data };
    if (!newData[viewingUser]) newData[viewingUser] = {};
    if (!newData[viewingUser][selectedMonth]) newData[viewingUser][selectedMonth] = {};
    if (!newData[viewingUser][selectedMonth][week]) {
      newData[viewingUser][selectedMonth][week] = { dailyCadence: '', shortCalls: '', briefings: '', adHoc: '' };
    }
    
    (newData[viewingUser][selectedMonth][week] as any)[category] = value;
    setData(newData);
    storageService.saveTaskData(newData);
  };

  // Get list of analysts who have entries if head
  const contributors = Object.keys(data);
  if (!contributors.includes(user.name)) contributors.push(user.name);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Weekly Task Tracker</h2>
            <p className="text-sm text-slate-500">Record your activities across the four core categories</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {user.role === 'Head' && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Contributor</label>
                <select 
                  value={viewingUser}
                  onChange={(e) => setViewingUser(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {contributors.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Month</label>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Analyst" value={viewingUser} />
          <StatCard label="Domain" value={user.domain === 'ALL' ? 'Leadership' : user.domain} />
          <StatCard label="Sub-Domain" value={user.subDomain === 'ALL' ? 'Strategic' : user.subDomain} />
          <StatCard label="Entries" value={Object.keys(data[viewingUser]?.[selectedMonth] || {}).length.toString() + "/4 Weeks"} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-slate-200">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 border-r border-slate-700 w-32 font-bold">{selectedMonth}</th>
              <th className="p-4 border-r border-slate-700">Daily Cadence</th>
              <th className="p-4 border-r border-slate-700">Short Calls</th>
              <th className="p-4 border-r border-slate-700">Briefings</th>
              <th className="p-4">Ad-Hoc / Others</th>
            </tr>
          </thead>
          <tbody>
            {WEEKS.map((week, idx) => {
              const weekData = data[viewingUser]?.[selectedMonth]?.[week] || {
                dailyCadence: '', shortCalls: '', briefings: '', adHoc: ''
              };
              const isEditable = user.role === 'Head' || viewingUser === user.name;
              return (
                <tr key={week} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-4 border-r border-slate-200 font-bold text-slate-400 text-center">{week}</td>
                  <TableCell 
                    value={weekData.dailyCadence} 
                    onChange={(v) => updateTask(week, 'dailyCadence', v)}
                    readOnly={!isEditable}
                    placeholder="Standups, routine ops..."
                  />
                  <TableCell 
                    value={weekData.shortCalls} 
                    onChange={(v) => updateTask(week, 'shortCalls', v)}
                    readOnly={!isEditable}
                    placeholder="Vendor/Stakeholder syncing..."
                  />
                  <TableCell 
                    value={weekData.briefings} 
                    onChange={(v) => updateTask(week, 'briefings', v)}
                    readOnly={!isEditable}
                    placeholder="Strategy/Executive briefings..."
                  />
                  <TableCell 
                    value={weekData.adHoc} 
                    onChange={(v) => updateTask(week, 'adHoc', v)}
                    readOnly={!isEditable}
                    placeholder="Requests, fires, extra work..."
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
    <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase tracking-widest">{label}</span>
    <span className="font-bold text-slate-700 truncate block">{value}</span>
  </div>
);

const TableCell = ({ value, onChange, readOnly, placeholder }: any) => (
  <td className="p-2 border-r border-slate-200 last:border-r-0">
    <textarea 
      disabled={readOnly}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 bg-transparent border-none text-sm focus:ring-2 focus:ring-blue-100 rounded-lg resize-none min-h-[100px] outline-none transition-all placeholder:text-slate-300 disabled:opacity-70"
      placeholder={placeholder}
    />
  </td>
);

export default TaskTracker;
