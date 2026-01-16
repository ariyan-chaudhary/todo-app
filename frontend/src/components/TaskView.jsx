import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';

const TaskView = ({ tasks, title, onSelectTask, onAddNewTask, isSticky }) => {
  if (isSticky) {
    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Sticky Wall</h1>
            <div className="flex flex-wrap gap-4">
                <div 
                    onClick={onAddNewTask}
                    className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-400"
                >
                     <Plus className="w-10 h-10 mb-2" />
                     <span className="font-bold text-lg">Add Note</span>
                </div>
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className="w-64 h-64 bg-yellow-light p-6 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow flex flex-col relative group"
                        onClick={() => onSelectTask(task)}
                    >
                         <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{task.title}</h3>
                         <p className="text-gray-600 text-sm line-clamp-6 flex-1">{task.description || "No description"}</p>
                         <div className="mt-4 flex justify-between items-center text-xs text-gray-500 font-medium">
                             <span>{task.dueDate || "No date"}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <div className="text-3xl font-bold bg-white border border-gray-200 rounded-lg px-4 py-1 text-gray-800 shadow-sm">
          {tasks.length}
        </div>
      </div>

      <div 
        onClick={onAddNewTask}
        className="border border-gray-200 rounded-lg bg-white p-3 mb-6 cursor-pointer hover:bg-gray-50 flex items-center gap-3 text-gray-400"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add New Task</span>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
            <div 
                key={task.id} 
                className="flex flex-col bg-white border-b border-gray-100 py-4 px-2 hover:bg-gray-50 cursor-pointer group"
                onClick={() => onSelectTask(task)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        <span className="text-gray-700 font-medium text-lg">{task.title}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex items-center gap-4 mt-2 ml-9">
                     {task.dueDate && (
                         <div className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded">
                             <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
                             {task.dueDate}
                         </div>
                     )}
                     {task.subtasks && task.subtasks.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded">
                             <span className="font-bold">{task.subtasks.length}</span> Subtasks
                         </div>
                     )}
                     <div className="flex gap-2">
                        {task.tags && task.tags.map(tag => (
                             <div key={tag} className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded bg-red-50 text-red-500 font-medium">
                                 {tag}
                             </div>
                        ))}
                     </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TaskView;
