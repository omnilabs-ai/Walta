const DashboardShowcase = () => {
  return (
    <div className="pt-16 pb-12 bg-slate-50"> {/* Changed py-16 to pt-16 pb-12 */}
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Developer Dashboard Interface
          </h2>
        </div>
        <div className="max-w-6xl mx-auto"> {/* Adjusted to wrap both image box and paragraph */}
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-slate-200">
            <img 
              src="/lovable-uploads/03792152-325b-4739-879a-30e7cdfa3f9e.png" 
              alt="Developer Dashboard Preview" 
              className="rounded-lg shadow-lg w-full h-auto" 
            />
          </div>
          <p className="mt-8 text-gray-700 text-center max-w-4xl text-xl font-medium mx-auto">
            Our comprehensive dashboard provides developers with real-time insights, transaction monitoring, and powerful tools to manage AI agent payments seamlessly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardShowcase; 