import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  TestTube2, 
  AlertCircle, 
  CheckCircle2, 
  Home, 
  Phone, 
  MessageCircle, 
  Info, 
  X,
  Filter
} from 'lucide-react';
import api from '../services/api';

const TestsPage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTest, setActiveModalTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, catRes] = await Promise.all([
          api.get('/tests/'),
          api.get('/tests/categories/'),
        ]);
        setTests(testsRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Failed to load tests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTests = tests.filter((test) => {
    const matchesCategory = selectedCategory === 'all' || test.category_slug === selectedCategory;
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (test.parameters_included && test.parameters_included.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Accusure Diagnostics Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Diagnostic Tests & Health Packages
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Find certified blood tests, organ profiles, and full-body checkups at transparent, affordable prices with 100% Free Doorstep Home Sample Collection in Jamshedpur.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search test by name, disease, or parameter (e.g. CBC, HbA1c, Thyroid, Lipid, Urea)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Checkups ({tests.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.slug
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading diagnostic tests...</div>
      ) : filteredTests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-800">No diagnostic tests found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-500">Try searching for other tests or clear your category filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {test.category_name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{test.code}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">
                  {test.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {test.description || 'Comprehensive clinical laboratory analysis.'}
                </p>

                {/* Meta specifications */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-sky-600" /> Report In:
                    </span>
                    <strong className="text-slate-800">{test.turnaround_hours} Hours</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <TestTube2 className="w-3.5 h-3.5 text-emerald-600" /> Specimen:
                    </span>
                    <strong className="text-slate-800">{test.sample_type}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Fasting:</span>
                    <strong className={test.fasting_required ? 'text-amber-700' : 'text-emerald-700'}>
                      {test.fasting_required ? `Yes (${test.fasting_hours || 8-10} hrs)` : 'No Fasting'}
                    </strong>
                  </div>
                </div>

                {/* Parameters Preview */}
                {test.parameters_included && (
                  <div className="text-[11px] text-slate-500 mb-4 line-clamp-2">
                    <strong className="text-slate-700">Includes: </strong>
                    {test.parameters_included}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900">₹{test.final_price}</span>
                    {test.discount_price && (
                      <span className="text-xs line-through text-slate-400">₹{test.price}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold block">Free Home Collection</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveModalTest(test)}
                    className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                    title="View Test Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <Link
                    to="/home-collection"
                    state={{ prefilledTest: test }}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test Detail Modal */}
      {activeModalTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setActiveModalTest(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              {activeModalTest.category_name}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">{activeModalTest.name}</h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">Code: {activeModalTest.code}</p>

            <div className="my-4 text-xs text-slate-600 leading-relaxed">
              {activeModalTest.description}
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 mb-4">
              <div><strong>Turnaround Time:</strong> {activeModalTest.turnaround_hours} Hours</div>
              <div><strong>Specimen Required:</strong> {activeModalTest.sample_type}</div>
              <div><strong>Fasting:</strong> {activeModalTest.fasting_required ? `Yes (${activeModalTest.fasting_hours} hrs)` : 'No Fasting Required'}</div>
              {activeModalTest.preparation_instructions && (
                <div><strong>Patient Preparation:</strong> {activeModalTest.preparation_instructions}</div>
              )}
              {activeModalTest.parameters_included && (
                <div><strong>Parameters Covered:</strong> {activeModalTest.parameters_included}</div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-2xl font-black text-slate-900">₹{activeModalTest.final_price}</span>
                {activeModalTest.discount_price && (
                  <span className="text-xs line-through text-slate-400 ml-2">₹{activeModalTest.price}</span>
                )}
              </div>
              <Link
                to="/home-collection"
                state={{ prefilledTest: activeModalTest }}
                onClick={() => setActiveModalTest(null)}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
              >
                Proceed to Book
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestsPage;

