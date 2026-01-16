import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import TaskView from './components/TaskView'
import TaskDetail from './components/TaskDetail'
import './index.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [lists, setLists] = useState([])
  const [tags, setTags] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeFilter, setActiveFilter] = useState('Today') // Today, Upcoming, Sticky Wall, or List Name

  const refreshData = () => {
    fetch('/api/tasks').then(res => res.json()).then(setTasks)
    fetch('/api/lists').then(res => res.json()).then(setLists)
    fetch('/api/tags').then(res => res.json()).then(setTags)
  };

  useEffect(() => {
    refreshData();
  }, [])

  const isToday = (dateString) => {
      if (!dateString) return false;
      const today = new Date().toISOString().split('T')[0];
      return dateString === today;
  }

  const isUpcoming = (dateString) => {
      if (!dateString) return false;
      const today = new Date().toISOString().split('T')[0];
      return dateString > today;
  }

  const counts = useMemo(() => {
      const c = { today: 0, upcoming: 0 };
      lists.forEach(l => c[l.name] = 0);
      
      tasks.forEach(task => {
          if (isToday(task.dueDate)) c.today++;
          if (isUpcoming(task.dueDate)) c.upcoming++;
          if (c[task.list] !== undefined) c[task.list]++;
      });
      return c;
  }, [tasks, lists]);

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'Sticky Wall') {
        return tasks; // Show all on sticky wall
    }
    if (activeFilter === 'Today') {
      return tasks.filter(task => isToday(task.dueDate)); 
    }
    if (activeFilter === 'Upcoming') {
        return tasks.filter(task => isUpcoming(task.dueDate));
    }
    return tasks.filter(task => task.list === activeFilter);
  }, [tasks, activeFilter]);

  const handleSelectTask = (task) => {
      setSelectedTask(task);
  }

  const handleCreateTask = () => {
      const defaultList = (activeFilter === 'Today' || activeFilter === 'Upcoming' || activeFilter === 'Sticky Wall') ? 'Personal' : activeFilter;
      const today = new Date().toISOString().split('T')[0];
      
      fetch('/api/tasks', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 
              title: 'New Task', 
              list: defaultList,
              dueDate: activeFilter === 'Today' ? today : ''
          })
      })
      .then(res => res.json())
      .then(newTask => {
          setTasks([...tasks, newTask]);
          setSelectedTask(newTask);
      });
  }

  const handleAddList = (name) => {
      fetch('/api/lists', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ name, color: '#ff6b6b' }) // Default color
      })
      .then(res => res.json())
      .then(newList => {
          setLists([...lists, newList]);
      });
  }

  const handleAddTag = (name) => {
      fetch('/api/tags', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ name })
      })
      .then(res => res.json())
      .then(newTag => {
          setTags([...tags, newTag]);
      });
  }

  const handleCloseDetail = () => {
      setSelectedTask(null);
  }

  const handleSaveTask = (updatedTask) => {
      fetch(`/api/tasks/${updatedTask.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(updatedTask)
      })
      .then(res => res.json())
      .then(savedTask => {
          setTasks(tasks.map(t => t.id === savedTask.id ? savedTask : t));
          setSelectedTask(null); 
      });
  }

  const handleDeleteTask = (taskId) => {
      fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE'
      })
      .then(() => {
          setTasks(tasks.filter(t => t.id !== taskId));
          setSelectedTask(null);
      });
  }

  return (
    <div className="flex h-screen w-full bg-bg-gray text-gray-900 font-sans overflow-hidden">
       <Sidebar 
          lists={lists} 
          tags={tags} 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddList={handleAddList}
          onAddTag={handleAddTag}
          counts={counts}
        />
       <main className="flex-1 flex overflow-hidden">
          <TaskView 
            tasks={filteredTasks} 
            title={activeFilter}
            onSelectTask={handleSelectTask} 
            onAddNewTask={handleCreateTask}
            isSticky={activeFilter === 'Sticky Wall'}
          />
          {selectedTask && (
            <TaskDetail 
                key={selectedTask.id}
                task={selectedTask} 
                lists={lists}
                allTags={tags}
                onClose={handleCloseDetail} 
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
                onAddTag={handleAddTag}
            />
          )}
       </main>
    </div>
  )
}

export default App
