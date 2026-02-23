
import React, { useState } from 'react';
import { DOMAIN_HIERARCHY } from '../constants';
import { User, Domain } from '../types';

interface UserSelectionProps {
  onSelect: (user: User) => void;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onSelect }) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState<Domain | 'ALL' | ''>('');
  const [subDomain, setSubDomain] = useState('');
  const [role, setRole] = useState<'Analyst' | 'Head'>('Analyst');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && domain && subDomain) {
      onSelect({
        id: Math.random().toString(36).substr(2, 9),
        name,
        role,
        domain: domain as Domain | 'ALL',
        subDomain
      });
    }
  };

  const domains = Object.keys(DOMAIN_HIERARCHY) as Domain[];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Portal Access</h1>
          <p className="text-blue-100 text-sm">Please identify your domain to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => { setRole('Analyst'); setDomain(''); setSubDomain(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'Analyst' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Analyst
            </button>
            <button 
              type="button"
              onClick={() => { setRole('Head'); setDomain('ALL'); setSubDomain('ALL'); }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'Head' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Head of Domain
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
              <input 
                required
                type="text" 
                placeholder="Enter full name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {role === 'Analyst' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Domain</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value as Domain);
                      setSubDomain('');
                    }}
                  >
                    <option value="">Select Domain...</option>
                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sub-Domain</label>
                  <select 
                    required
                    disabled={!domain || domain === 'ALL'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                    value={subDomain}
                    onChange={(e) => setSubDomain(e.target.value)}
                  >
                    <option value="">Select Sub-Domain...</option>
                    {domain && domain !== 'ALL' && DOMAIN_HIERARCHY[domain as Domain].map(sd => (
                      <option key={sd} value={sd}>{sd}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSelection;
