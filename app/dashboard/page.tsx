import SnapReport from '@/components/SnapReport';
import TransparencyBoard from '@/components/TransparencyBoard';
import PolicyTranslator from '@/components/PolicyTranslator';
import VoiceCompanion from '@/components/VoiceCompanion';
import GovernmentServices from '@/components/GovernmentServices';

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
          <a href="/my-complaints" className="block px-4 py-3 hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors">
            My Complaints
          </a>
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

            {/* Inner Scrollable Area */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">

              {/* Grid Container with added mb-8 for spacing */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-7xl mx-auto mb-8">

                {/* Left Column: AI Reporter */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-gray-800">Report an Issue</h3>
                  <p className="text-gray-500 mb-2">Upload a photo and let AI generate the official grievance draft.</p>
                  <SnapReport />
                </div>

                {/* Right Column: Dashboard */}
                <div className="flex flex-col gap-4">
                  <TransparencyBoard />
                </div>

              </div>

              {/* NEW SECTION: Policy Translator */}
              <div className="w-full max-w-7xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Understand Government Schemes</h3>
                <PolicyTranslator />
              </div>
              {/* New Government Services Section */}
              <div className="w-full max-w-7xl mx-auto mt-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Find Government Schemes</h3>
                <GovernmentServices />
              </div>
            </div>
          </div>
        </div>
        {/* Floating Voice Companion */}
        <VoiceCompanion />
      </main>
    </div>
  );
}