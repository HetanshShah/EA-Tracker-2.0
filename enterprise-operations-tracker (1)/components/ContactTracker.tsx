
import React, { useState } from 'react';
import { User, ContactEntry } from '../types';
import { storageService } from '../services/storageService';
import { DOMAIN_HIERARCHY } from '../constants';

interface ContactTrackerProps {
  user: User;
}

const ContactTracker: React.FC<ContactTrackerProps> = ({ user }) => {
  const [contacts, setContacts] = useState<ContactEntry[]>(storageService.getContactData());
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all subdomains from the hierarchy for dropdowns
  const allSubDomains = Object.values(DOMAIN_HIERARCHY).flat();

  const filteredContacts = contacts.filter(c => {
    const isDomainMatch = user.role === 'Head' || c.subDomain === user.subDomain;
    const isSearchMatch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.owner.toLowerCase().includes(searchTerm.toLowerCase());
    return isDomainMatch && isSearchMatch;
  });

  const addRow = () => {
    const newEntry: ContactEntry = {
      id: Date.now().toString(),
      // Use "ERP" as a fallback default or the user's assigned subdomain
      subDomain: user.role === 'Head' ? 'ERP' : user.subDomain as string,
      owner: user.name,
      customerName: '',
      leadARCo: '',
      emailId: '',
      leadSource: '',
      pastSale: 'No',
      pastSaleValue: '',
      reachOutStatus: '',
      initialCall: 'No',
      initialCallDate: '',
      rfiSent: 'No',
      rfiSentFollowUp: ''
    };
    const updated = [...contacts, newEntry];
    setContacts(updated);
    storageService.saveContactData(updated);
  };

  const updateEntry = (id: string, field: keyof ContactEntry, value: string) => {
    const updated = contacts.map(c => c.id === id ? { ...c, [field]: value } : c);
    setContacts(updated);
    storageService.saveContactData(updated);
  };

  const deleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this row?')) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      storageService.saveContactData(updated);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">Contact Facilitation Sheet</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search records..."
            className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={addRow}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="p-4 border-b border-slate-200">SI</th>
              <th className="p-4 border-b border-slate-200">Sub-domain</th>
              <th className="p-4 border-b border-slate-200">Owner</th>
              <th className="p-4 border-b border-slate-200">Customer Name</th>
              <th className="p-4 border-b border-slate-200 w-48">Lead AR Co</th>
              <th className="p-4 border-b border-slate-200">Email ID</th>
              <th className="p-4 border-b border-slate-200">Past Sale?</th>
              <th className="p-4 border-b border-slate-200">RFI Sent?</th>
              <th className="p-4 border-b border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredContacts.map((c, idx) => (
              <tr key={c.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <td className="p-4 font-bold text-slate-400">{idx + 1}</td>
                <td className="p-2">
                  <select 
                    value={c.subDomain}
                    disabled={user.role !== 'Head'}
                    onChange={(e) => updateEntry(c.id, 'subDomain', e.target.value)}
                    className="w-full p-1 border-none bg-transparent focus:ring-1 focus:ring-blue-200 rounded disabled:opacity-75"
                  >
                    {allSubDomains.map(sd => (
                      <option key={sd} value={sd}>{sd}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <input 
                    value={c.owner}
                    onChange={(e) => updateEntry(c.id, 'owner', e.target.value)}
                    className="w-full p-1 border-none bg-transparent focus:ring-1 focus:ring-blue-200 rounded"
                  />
                </td>
                <td className="p-2">
                  <input 
                    value={c.customerName}
                    onChange={(e) => updateEntry(c.id, 'customerName', e.target.value)}
                    className="w-full p-1 border-none bg-transparent focus:ring-1 focus:ring-blue-200 rounded font-semibold text-slate-700"
                    placeholder="Company name"
                  />
                </td>
                <td className="p-2">
                   <input 
                    value={c.leadARCo}
                    onChange={(e) => updateEntry(c.id, 'leadARCo', e.target.value)}
                    className="w-full p-1 border-none bg-transparent focus:ring-1 focus:ring-blue-200 rounded"
                    placeholder="Analyst contact"
                  />
                </td>
                <td className="p-2">
                  <input 
                    value={c.emailId}
                    onChange={(e) => updateEntry(c.id, 'emailId', e.target.value)}
                    className="w-full p-1 border-none bg-transparent focus:ring-1 focus:ring-blue-200 rounded italic text-blue-600"
                    placeholder="email@company.com"
                  />
                </td>
                <td className="p-2">
                  <select 
                    value={c.pastSale}
                    onChange={(e) => updateEntry(c.id, 'pastSale', e.target.value)}
                    className={`w-full p-1 border-none focus:ring-1 focus:ring-blue-200 rounded ${c.pastSale === 'Yes' ? 'text-green-600 font-bold' : ''}`}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </td>
                <td className="p-2">
                  <select 
                    value={c.rfiSent}
                    onChange={(e) => updateEntry(c.id, 'rfiSent', e.target.value)}
                    className={`w-full p-1 border-none focus:ring-1 focus:ring-blue-200 rounded ${c.rfiSent === 'Yes' ? 'text-indigo-600 font-bold' : ''}`}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => deleteEntry(c.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-400 italic">
                  No records found. Click "Add New" to start tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTracker;
