import { Search, X, CheckSquare, Square, RotateCcw } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedChildCategory: string;
  onSelectChildCategory: (childCategory: string) => void;
  categoriesConfig: Record<string, Record<string, string[]>>;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
  selectedBrandsOrAuthors: string[];
  onToggleBrandOrAuthor: (name: string) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  onResetFilters: () => void;
}

export default function Sidebar({
  activeTab,
  selectedCategory,
  onSelectCategory,
  selectedChildCategory,
  onSelectChildCategory,
  categoriesConfig,
  selectedSort,
  onSelectSort,
  selectedBrandsOrAuthors,
  onToggleBrandOrAuthor,
  inStockOnly,
  onToggleInStock,
  onResetFilters,
}: SidebarProps) {

  const getBrandsOrAuthors = () => {
    switch (activeTab) {
      case 'books':
        return ['থিবো মেউরিচ', 'ড. আয়েজ আল করনী', 'সৈকত আমীন', 'লর্ড আই. সি. জো', 'জেমস ক্লিয়ার', 'ডা. শামসুল আরেফীন', 'আব্দুল্লাহ আল-জাবির'];
      case 'electronics':
        return ['Orico (ওরিকো)', 'Sanford (স্যানফোর্ড)', 'UGREEN (ইউগ্রীন)', 'GEEOO (জিইও)', 'Defender (ডিফেন্ডার)', 'Megastar (মেগাস্টার)', 'Non-Brand'];
      case 'superstore':
        return ['ভেষজ এগ্রো', 'COSPROF', 'Lily (লিলি)', "Layer'r", 'Non-Brand'];
      case 'fashion':
        return ['Topsell Fashion', 'Denim Republic', 'StepUp Footwear', 'Aarong Style', 'Apex Leather Craft', 'Biba Ethnic'];
      case 'kids':
        return ['অ্যাপেল বেয়ার', 'Barbie (বার্বি)', 'Philips Avent (ফিলিপস অ্যাভেন্ট)', 'Mitu Home', 'Non-Brand'];
      default:
        return [];
    }
  };

  const options = getBrandsOrAuthors();
  const tabCategories = categoriesConfig[activeTab] || {};
  const categoriesList = Object.keys(tabCategories);

  // Exclude tabs like corporate, today's offer, awards or affiliate page which do not require sidebars
  if (['corporate', 'awards', 'offers', 'boimela', 'affiliate'].includes(activeTab)) {
    return null;
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-5 bg-white p-4 rounded border border-gray-200 shadow-xs h-fit">
      
      {/* 1. Header with Reset triggers */}
      <div className="flex justify-between items-center pb-2.5 border-b border-gray-150">
        <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight font-sans">Filter & Sort Selection</h2>
        <button
          onClick={onResetFilters}
          className="text-xs text-rose-500 font-extrabold hover:underline flex items-center space-x-0.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 2. Shop by Categories */}
      <div className="space-y-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight font-sans">Shop by Categories</h3>
        <div className="flex flex-col space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {/* All Categories Button */}
          <button
            onClick={() => {
              onSelectCategory('');
              onSelectChildCategory('');
            }}
            className={`text-xs sm:text-[13.5px] text-left py-2 px-2.5 rounded transition-all flex justify-between items-center cursor-pointer ${
              selectedCategory === ''
                ? 'bg-sky-50 text-sky-700 font-bold border-l-2 border-sky-500'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-850'
            }`}
          >
            <span className="truncate">সকল আইটেম</span>
          </button>

          {/* List each subcategory */}
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat;
            const childCategories = tabCategories[cat] || [];
            
            return (
              <div key={cat} className="flex flex-col space-y-1">
                <button
                  onClick={() => {
                    onSelectCategory(cat);
                    onSelectChildCategory('');
                  }}
                  className={`text-xs sm:text-[13.5px] text-left py-2 px-2.5 rounded transition-all flex justify-between items-center cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 text-sky-700 font-bold border-l-2 border-sky-500'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-850'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                </button>

                {/* Indented child categories */}
                {childCategories.length > 0 && (
                  <div className="pl-4 flex flex-col space-y-1 border-l border-slate-100 ml-2 py-0.5">
                    {childCategories.map((child) => {
                      const isChildSelected = selectedCategory === cat && selectedChildCategory === child;
                      return (
                        <button
                          key={child}
                          onClick={() => {
                            onSelectCategory(cat);
                            onSelectChildCategory(child);
                          }}
                          className={`text-xs sm:text-[12.5px] text-left py-1.5 px-2 rounded transition-all flex items-center space-x-1 cursor-pointer ${
                            isChildSelected
                              ? 'text-sky-600 font-bold bg-sky-50/70'
                              : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'
                          }`}
                        >
                          <span className="opacity-60 font-mono text-[10px]">└─</span>
                          <span className="truncate">{child}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. In stock availability Checkers */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between pb-1">
        <span className="text-xs sm:text-sm font-bold text-slate-700 font-sans">Availability</span>
        <button
          id="filter-instock-btn"
          onClick={onToggleInStock}
          className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-800 text-xs sm:text-[13px] font-sans font-medium cursor-pointer"
        >
          {inStockOnly ? (
            <CheckSquare className="w-4 h-4 text-emerald-600 fill-emerald-50" />
          ) : (
            <Square className="w-4 h-4 text-slate-350" />
          )}
          <span>In Stock Only</span>
        </button>
      </div>

      {/* 4. Sort Options panel */}
      <div className="space-y-2.5 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight font-sans">Sort By</h3>
        </div>
        <div className="space-y-2.5">
          {[
            { id: 'best-seller', label: 'Best Seller' },
            { id: 'new-released', label: 'New Released' },
            { id: 'price-low-high', label: 'Price - Low to High' },
            { id: 'price-high-low', label: 'Price - High to Low' },
            { id: 'discount-high-low', label: 'Discount - High to Low' },
          ].map((opt) => {
            const isSelected = selectedSort === opt.id;
            return (
              <label
                key={opt.id}
                className="flex items-center space-x-2 text-xs sm:text-[13px] text-slate-600 cursor-pointer select-none py-0.5"
              >
                <input
                  type="radio"
                  name="sidebar-sort-option"
                  checked={isSelected}
                  onChange={() => onSelectSort(opt.id)}
                  className="w-3.5 h-3.5 text-sky-600 border-gray-350 focus:ring-sky-500"
                />
                <span className={isSelected ? 'text-sky-750 font-bold' : ''}>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Brand or Author lists checkboxes */}
      {options.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          <h3 className="text-xs font-bold text-slate-700 tracking-tight font-sans">
            {activeTab === 'books' ? 'By Authors' : 'By Brands'}
          </h3>
          <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto pr-1">
            {options.map((opt) => {
              const isChecked = selectedBrandsOrAuthors.includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center space-x-2 text-[11px] text-slate-600 hover:text-slate-800 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrandOrAuthor(opt)}
                    className="rounded text-sky-600 focus:ring-sky-500 w-3.5 h-3.5 border-gray-350"
                  />
                  <span className={isChecked ? 'text-slate-800 font-bold' : ''}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
