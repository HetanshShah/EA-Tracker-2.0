import React, { useMemo } from 'react';
import { LinkedInTrackerData, ReportTrackerData, Domain } from '../types';
import { DOMAIN_HIERARCHY, MONTHS } from '../constants';
import { storageService } from '../services/storageService';

const Dashboard: React.FC = () => {
  const linkedInData = useMemo(() => storageService.getLinkedInData(), []);
  const reportData = useMemo(() => storageService.getReportData(), []);
  const currentMonth = MONTHS[new Date().getMonth()];

  const domainStats = useMemo(() => {
    return Object.entries(DOMAIN_HIERARCHY).map(([domain, subDomains]) => {
      let linkedInTotal = 0;
      let linkedInCompleted = 0;
      let reportsTotal = 0;
      let reportsCompleted = 0;

      subDomains.forEach(sd => {
        // LinkedIn Stats
        const liMonth = linkedInData[sd]?.[currentMonth] || {};
        const analysts = Object.keys(liMonth);
        analysts.forEach(a => {
          linkedInTotal += 2; // Target 2 posts
          if (liMonth[a].individual === 'Completed') linkedInCompleted++;
          if (liMonth[a].subdomain === 'Completed') linkedInCompleted++;
        });

        // Report Stats (MIR/QIR/QBR) - Using "Sent" or "Finalised" as indicators of completion
        const year = new Date().getFullYear().toString();
        const repMonth = reportData[sd]?.[year]?.[currentMonth] || {};
        const repAnalysts = Object.keys(repMonth);
        repAnalysts.forEach(a => {
          reportsTotal++;
          // We'll consider a report "Completed" for dashboard purposes if it's Sent or Finalised
          if (repMonth[a].mir === 'Sent' || repMonth[a].mir === 'Finalised') reportsCompleted++;
        });
      });

      return {
        domain,
        linkedIn: { total: linkedInTotal, completed: linkedInCompleted },
        reports: { total: reportsTotal, completed: reportsCompleted }
      };
    });
  }, [linkedInData, reportData, currentMonth]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {domainStats.map(stat => (
          <div key={stat.domain} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <h3 className="font-bold text-slate-800 mb-4 h-12 overflow-hidden leading-tight">{stat.domain}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1">
                  <span>LinkedIn Posts</span>
                  <span>{Math.round((stat.linkedIn.completed / (stat.linkedIn.total || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-1000" 
                    style={{ width: `${(stat.linkedIn.completed / (stat.linkedIn.total || 1)) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{stat.linkedIn.completed}/{stat.linkedIn.total} Target Posts</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase mb-1">
                  <span>Monthly Reports (MIR)</span>
                  <span>{Math.round((stat.reports.completed / (stat.reports.total || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-1000" 
                    style={{ width: `${(stat.reports.completed / (stat.reports.total || 1)) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{stat.reports.completed}/{stat.reports.total} Analysts Reported</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Sub-Domain Breakdown ({currentMonth})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(DOMAIN_HIERARCHY).map(([domain, subDomains]) => (
            <div key={domain} className="space-y-4">
              <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2">{domain}</h4>
              <div className="space-y-3">
                {subDomains.map(sd => {
                  const liData = linkedInData[sd]?.[currentMonth] || {};
                  const analystsCount = Object.keys(liData).length;
                  return (
                    <div key={sd} className="flex justify-between items-center group">
                      <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{sd}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${analystsCount > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                        {analystsCount} Active Analysts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;