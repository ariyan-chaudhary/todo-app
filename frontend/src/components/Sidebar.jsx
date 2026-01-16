import React, { useState } from 'react';
import { Menu, Search, List, Plus, Settings, LogOut, StickyNote, ChevronsRight } from 'lucide-react';

const Sidebar = ({ lists, tags, activeFilter, onFilterChange, onAddList, onAddTag, counts }) => {
  const [newListName, setNewListName] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleCreateList = () => {
      if(newListName.trim()) {
          onAddList(newListName);
          setNewListName('');
          setIsAddingList(false);
      }
  };

  const handleCreateTag = () => {
      if(newTagName.trim()) {
          onAddTag(newTagName);
          setNewTagName('');
          setIsAddingTag(false);
      }
  };

  return (
    <div className="w-64 bg-sidebar-bg h-screen p-6 flex flex-col border-r border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">Menu</h1>
        <Menu className="w-5 h-5 text-gray-400" />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" 
        />
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Tasks</h3>
        <NavItem 
            icon={ChevronsRight} 
            label="Upcoming" 
            count={counts.upcoming} 
            active={activeFilter === 'Upcoming'}
            onClick={() => onFilterChange('Upcoming')}
        />
        <NavItem 
            icon={List} 
            label="Today" 
            count={counts.today} 
            active={activeFilter === 'Today'} 
            onClick={() => onFilterChange('Today')}
        />
        <NavItem 
            icon={StickyNote} 
            label="Sticky Wall"
            active={activeFilter === 'Sticky Wall'} 
            onClick={() => onFilterChange('Sticky Wall')} 
        />
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Lists</h3>
        {lists.map(list => (
           <div 
             key={list.id} 
             className={`flex items-center justify-between px-3 py-2 text-gray-600 rounded-lg cursor-pointer ${activeFilter === list.name ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
             onClick={() => onFilterChange(list.name)}
            >
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded bg-red-400" style={{ backgroundColor: list.color }}></div>
               <span className="text-sm font-medium">{list.name}</span>
             </div>
             <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded">{counts[list.name] || 0}</span>
           </div>
        ))}
         
         {!isAddingList ? (
            <div 
                className="flex items-center gap-3 px-3 py-2 text-gray-500 cursor-pointer hover:text-gray-700" 
                onClick={() => setIsAddingList(true)}
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add New List</span>
            </div>
         ) : (
             <div className="flex items-center gap-2 px-3 py-2">
                 <input 
                    autoFocus
                    className="w-full text-sm border-b border-gray-300 focus:outline-none"
                    placeholder="List Name" 
                    value={newListName}
                    onChange={e => setNewListName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateList()}
                    onBlur={() => setIsAddingList(false)}
                 />
             </div>
         )}
      </div>

      <div className="mb-auto">
        <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Tags</h3>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">{tag.name}</span>
            ))}
            {!isAddingTag ? (
                <button 
                    onClick={() => setIsAddingTag(true)}
                    className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-200"
                >
                    <Plus className="w-3 h-3" /> Add Tag
                </button>
            ) : (
                <input 
                    autoFocus
                    className="w-20 text-xs border border-gray-300 rounded px-1"
                    placeholder="Tag Name"
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateTag()}
                    onBlur={() => setIsAddingTag(false)}
                />
            )}
        </div>
      </div>

      <div className="space-y-2 mt-6">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-lg">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
          </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, count, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {count !== undefined && (
      <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded">{count}</span>
    )}
  </div>
);

export default Sidebar;
