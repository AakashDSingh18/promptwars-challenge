export default function Home() {
  return (
    <div className="h-screen w-full flex bg-gray-50">
      {/* Sidebar - Hidden on mobile, fixed width w-64 */}
      <aside className="hidden md:flex w-64 flex-col bg-gray-900 text-white">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight">Smart Bharat</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          <a href="#" className="block px-4 py-3 bg-blue-600 rounded-lg text-sm font-medium shadow-sm">Home</a>
          <a href="#" className="block px-4 py-3 hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">Services</a>
          <a href="#" className="block px-4 py-3 hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">My Complaints</a>
          <a href="#" className="block px-4 py-3 hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">Resources</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white px-6 md:px-8 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Hello, Citizen!</h2>
          {/* Mock User Avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            C
          </div>
        </header>

        {/* Chat Interface Box Container */}
        <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col">
          <div className="flex-1 bg-white shadow-lg rounded-xl flex flex-col overflow-hidden w-full mx-auto border border-gray-100 relative">
            
            {/* AI Chat Stream Placeholder */}
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/30">
              <p className="text-lg font-medium">AI Chat Stream</p>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex gap-3 max-w-5xl mx-auto w-full">
                <input 
                  type="text" 
                  placeholder="Type your question or report an issue..." 
                  className="flex-1 px-5 py-3.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 bg-gray-50 focus:bg-white transition-all shadow-sm"
                />
                <button className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
