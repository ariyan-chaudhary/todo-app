import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const TaskDetail = ({ task, lists, allTags, onClose, onSave, onDelete, onAddTag }) => {
  const [formData, setFormData] = useState(task);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setFormData(task);
  }, [task]);

  if (!task) return null;

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleListChange = (e) => {
      setFormData(prev => ({ ...prev, list: e.target.value }));
  }

  const handleAddTagToTask = (tagName) => {
      if (!tagName.trim()) {
           setIsAddingTag(false);
           return;
      }
      
      // Add to global tags if it doesn't exist
      if (!allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase())) {
          onAddTag(tagName);
      }
      
      // Add to local task tags if not present
      if (!formData.tags.includes(tagName)) {
         setFormData(prev => ({ ...prev, tags: [...prev.tags, tagName] }));
      }
      setTagInput('');
      setIsAddingTag(false);
  };

  return (
    <div className="w-96 bg-gray-50 h-screen p-6 border-l border-gray-200 overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Task:</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="mb-6">
        <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-transparent border border-gray-300 rounded p-3 text-gray-600 mb-4 focus:bg-white focus:border-blue-300 focus:outline-none"
        />
        <textarea 
            name="description"
            placeholder="Description" 
            className="w-full h-32 bg-transparent border border-gray-300 rounded p-3 text-gray-600 resize-none focus:bg-white focus:border-blue-300 focus:outline-none"
            value={formData.description}
            onChange={handleChange}
        ></textarea>
      </div>

      <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-500 w-20">List</label>
              <select 
                value={formData.list} 
                onChange={handleListChange}
                className="bg-transparent border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 w-full focus:bg-white"
              >
                  {lists.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                  ))}
              </select>
          </div>
          <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-500 w-20">Due date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="bg-transparent border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 w-full focus:bg-white" />
          </div>
          <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-500 w-20">Tags</label>
              <div className="flex flex-wrap gap-2">
                  {formData.tags && formData.tags.map(tag => (
                      <div key={tag} className="bg-gray-200 px-3 py-1 rounded text-sm text-gray-600 font-medium">{tag}</div>
                  ))}
                  
                   {!isAddingTag ? (
                        <button 
                            onClick={() => setIsAddingTag(true)}
                            className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded text-sm text-gray-600 font-medium hover:bg-gray-300"
                        >
                            <Plus className="w-3 h-3" /> Add Tag
                        </button>
                    ) : (
                        <input 
                            autoFocus
                            className="w-24 text-sm border border-gray-300 rounded px-1"
                            placeholder="Tag Name"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAddTagToTask(tagInput)}
                            onBlur={() => setIsAddingTag(false)}
                        />
                    )}
              </div>
          </div>
      </div>

      <div className="mb-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Subtasks:</h3>
          <div className="flex items-center gap-2 text-gray-500 mb-4 cursor-pointer hover:text-gray-700">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New Subtask</span>
          </div>
          {formData.subtasks && formData.subtasks.map(sub => (
              <div key={sub.id} className="flex items-center gap-3 mb-2">
                  <input type="checkbox" checked={sub.completed} className="rounded border-gray-300" />
                  <span className="text-gray-600 text-sm">{sub.title}</span>
              </div>
          ))}
      </div>

      <div className="flex gap-4 mt-6">
          <button 
            onClick={() => onDelete(formData.id)}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
              Delete Task
          </button>
          <button 
            className="flex-1 py-2 px-4 bg-yellow-tag text-gray-900 rounded-lg text-sm font-bold hover:bg-yellow-400" 
            onClick={() => onSave(formData)}
          >
              Save changes
          </button>
      </div>

    </div>
  );
};

export default TaskDetail;
