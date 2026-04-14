import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewCommunityAction } from "../../redux/actions/communityActions";

const CreateCommunityModal = ({ show, toggle }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(createNewCommunityAction(formData));
      if (result.success) {
        setFormData({ name: "", description: "", banner: "" });
        toggle(); // close modal
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with strong blur */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={toggle}
      ></div>

      {/* Glassmorphism modal content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-8 shadow-2xl backdrop-blur-md transition-all duration-300">
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent">
            Create a Community
          </h2>
          <button
            onClick={toggle}
            className="rounded-full bg-white/50 p-2 text-gray-500 transition-colors hover:bg-white/80 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Community Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. GenZ Vibes"
              className="w-full rounded-xl border-none bg-white/60 px-4 py-3 text-gray-800 shadow-inner outline-none ring-2 ring-transparent transition-all focus:bg-white focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Description *</label>
            <textarea
              name="description"
              required
              rows="3"
              placeholder="What is this community about?"
              className="w-full resize-none rounded-xl border-none bg-white/60 px-4 py-3 text-gray-800 shadow-inner outline-none ring-2 ring-transparent transition-all focus:bg-white focus:ring-blue-400"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Banner URL (Optional)</label>
            <input
              type="url"
              name="banner"
              placeholder="https://example.com/banner.jpg"
              className="w-full rounded-xl border-none bg-white/60 px-4 py-3 text-gray-800 shadow-inner outline-none ring-2 ring-transparent transition-all focus:bg-white focus:ring-blue-400"
              value={formData.banner}
              onChange={handleChange}
            />
            {formData.banner && (
              <div className="mt-3 overflow-hidden rounded-xl border border-white/20 shadow-sm">
                <img src={formData.banner} alt="Banner Preview" className="h-24 w-full object-cover" />
              </div>
            )}
          </div>

          {error && <div className="rounded-lg bg-red-100/80 px-4 py-2 text-sm text-red-600 backdrop-blur-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading || !formData.name || !formData.description}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Creating..." : "Create Community"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
