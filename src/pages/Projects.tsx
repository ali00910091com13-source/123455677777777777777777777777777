import { useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  audio: string | null;
  audioName: string;
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'طراحی وبسایت فروشگاهی',
      description: 'طراحی و توسعه یک وبسایت فروشگاهی مدرن با React و Tailwind CSS',
      image: null,
      audio: null,
      audioName: '',
      createdAt: '۱۴۰۵/۰۱/۱۵',
      status: 'active',
    },
    {
      id: 2,
      title: 'اپلیکیشن موبایل',
      description: 'ساخت اپلیکیشن مدیریت وظایف با React Native',
      image: null,
      audio: null,
      audioName: '',
      createdAt: '۱۴۰۵/۰۱/۱۰',
      status: 'completed',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newAudio, setNewAudio] = useState<string | null>(null);
  const [newAudioName, setNewAudioName] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewAudio(event.target?.result as string);
        setNewAudioName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const addProject = () => {
    if (!newTitle.trim()) return;
    const project: Project = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      image: newImage,
      audio: newAudio,
      audioName: newAudioName,
      createdAt: new Date().toLocaleDateString('fa-IR'),
      status: 'active',
    };
    setProjects([project, ...projects]);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewImage(null);
    setNewAudio(null);
    setNewAudioName('');
    setShowForm(false);
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'completed':
        return 'تکمیل شده';
      case 'paused':
        return 'متوقف';
      default:
        return 'نامشخص';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              پروژه‌های من
            </span>
          </h1>
          <p className="text-gray-400 mt-2">{projects.length} پروژه ثبت شده</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          پروژه جدید
        </button>
      </div>

      {/* New Project Form */}
      {showForm && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8 animate-in">
          <h3 className="text-xl font-bold mb-6">ایجاد پروژه جدید</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">عنوان پروژه *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: طراحی اپلیکیشن..."
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">توضیحات</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="توضیحات پروژه را بنویسید..."
                rows={4}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 placeholder-gray-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">تصویر پروژه</label>
                <label className="flex flex-col items-center justify-center w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                  {newImage ? (
                    <img src={newImage} alt="preview" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-400">انتخاب تصویر</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">فایل صوتی</label>
                <label className="flex flex-col items-center justify-center w-full h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                  {newAudio ? (
                    <div className="text-center p-2">
                      <span className="text-3xl mb-2 block">🎵</span>
                      <span className="text-sm text-gray-400 truncate block max-w-full">{newAudioName}</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <span className="text-sm text-gray-400">انتخاب فایل صوتی</span>
                    </>
                  )}
                  <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={addProject}
                disabled={!newTitle.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ذخیره پروژه
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedProject(null)}>
          <div className="bg-slate-800 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-white/10 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedProject.status)}`}>
                {getStatusText(selectedProject.status)}
              </span>
              <p className="text-gray-400 mt-4 leading-relaxed">{selectedProject.description}</p>
              {selectedProject.image && (
                <div className="mt-4">
                  <img src={selectedProject.image} alt={selectedProject.title} className="rounded-xl w-full max-h-80 object-cover" />
                </div>
              )}
              {selectedProject.audio && (
                <div className="mt-4 bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-gray-400 mb-2">🎵 فایل صوتی</p>
                  <audio controls className="w-full">
                    <source src={selectedProject.audio} />
                  </audio>
                </div>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => deleteProject(selectedProject.id)}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                >
                  حذف پروژه
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">تاریخ ایجاد: {selectedProject.createdAt}</p>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            {/* Image */}
            {project.image ? (
              <div className="h-48 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                <svg className="w-16 h-16 text-purple-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className="text-xs text-gray-500">{project.createdAt}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">{project.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>

              {/* Media Indicators */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                {project.image && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    تصویر
                  </span>
                )}
                {project.audio && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    صوت
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  متن
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">هنوز پروژه‌ای ندارید</h3>
          <p className="text-gray-500">اولین پروژه خود را ایجاد کنید!</p>
        </div>
      )}
    </div>
  );
}

export default Projects;
