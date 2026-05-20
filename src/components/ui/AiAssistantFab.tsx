import './AiAssistantFab.css'

export default function AiAssistantFab() {
  return (
    <div className="fab-wrapper fixed right-6 bottom-6 w-16 h-16 rounded-full border-2 bg-white dark:bg-slate-900 border-blue-500/20 dark:border-blue-400/30 shadow-xl shadow-blue-900/10 flex items-center justify-center z-50 cursor-pointer group hover:scale-110 hover:border-blue-500 transition-transform">
      <span className="material-symbols-outlined fab-icon text-[#001943] dark:text-blue-400 text-3xl animate-pulse" data-icon="smart_toy">smart_toy</span>
      <div className="fab-tooltip absolute right-20 bottom-0 bg-white border border-slate-200 p-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity w-64">
        <div className="fab-tooltip-title font-bold text-[#001943] text-sm mb-1">AgenticX AI</div>
        <div className="fab-tooltip-desc text-xs text-slate-500 mb-3">Active Session: How can I help with your career track today?</div>
        <div className="fab-tooltip-action bg-slate-50 p-2 rounded text-[10px] font-bold text-blue-600 uppercase tracking-wider text-center">New Chat</div>
      </div>
    </div>
  )
}
