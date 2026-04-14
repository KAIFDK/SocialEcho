import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPostAction,
  clearCreatePostFail,
} from "../../redux/actions/postActions";
import InappropriatePostModal from "../modals/InappropriatePostModal";
import TopicConflictModal from "../modals/TopicConflictModal";
import EligibilityDetectionFailModal from "../modals/EligibilityDetectionFailModal";

const PostForm = ({ communityId, communityName }) => {
  const dispatch = useDispatch();
  const [showInappropriateContentModal, setShowInappropriateContentModal] = useState(false);
  const [showTopicConflictModal, setShowTopicConflictModal] = useState(false);
  const [showEligibilityDetectionFailModal, setShowEligibilityDetectionFailModal] = useState(false);

  const [formData, setFormData] = useState({
    content: "",
    file: null,
    previewUrl: null,
    fileType: null, // 'image' or 'video'
    error: "",
    loading: false,
  });

  const { isPostInappropriate, postCategory, confirmationToken } = useSelector(
    (state) => ({
      isPostInappropriate: state.posts?.isPostInappropriate,
      postCategory: state.posts?.postCategory,
      confirmationToken: state.posts?.confirmationToken,
    })
  );

  const handleContentChange = (event) => {
    setFormData({
      ...formData,
      content: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size <= 50 * 1024 * 1024) {
      const type = selectedFile.type.startsWith("video/") ? "video" : "image";
      setFormData({
        ...formData,
        file: selectedFile,
        previewUrl: URL.createObjectURL(selectedFile),
        fileType: type,
        error: "",
      });
    } else {
      setFormData({
        ...formData,
        file: null,
        previewUrl: null,
        fileType: null,
        error: "Please select an image or video file under 50MB.",
      });
    }
  };

  useEffect(() => {
    if (isPostInappropriate) setShowInappropriateContentModal(true);
    if (postCategory) setShowTopicConflictModal(true);
    if (confirmationToken) setShowEligibilityDetectionFailModal(true);
  }, [isPostInappropriate, postCategory, confirmationToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { content, file, loading } = formData;
    if (loading) return;

    if (!content && !file) {
      setFormData({
        ...formData,
        error: "Please enter a message or select a file.",
      });
      return;
    }

    const newPost = new FormData();
    newPost.append("content", content);
    newPost.append("communityId", communityId);
    newPost.append("communityName", communityName);
    if (file) newPost.append("file", file);

    setFormData({ ...formData, loading: true });

    try {
      await dispatch(createPostAction(newPost));
      setFormData({
        content: "",
        file: null,
        previewUrl: null,
        fileType: null,
        error: "",
        loading: false,
      });
      event.target.reset();
    } catch (error) {
      setFormData({ ...formData, loading: false });
    }
  };

  const handleRemoveFile = () => {
    if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    setFormData({
      ...formData,
      file: null,
      previewUrl: null,
      fileType: null,
      error: "",
    });
  };

  return (
    <>
      <InappropriatePostModal
        closeInappropriateContentModal={() => {
          setShowInappropriateContentModal(false);
          dispatch(clearCreatePostFail());
        }}
        showInappropriateContentModal={showInappropriateContentModal}
        contentType={"post"}
      />

      <TopicConflictModal
        closeTopicConflictModal={() => {
          setShowTopicConflictModal(false);
          dispatch(clearCreatePostFail());
        }}
        showTopicConflictModal={showTopicConflictModal}
        communityName={postCategory?.community}
        recommendedCommunity={postCategory?.recommendedCommunity}
      />

      <EligibilityDetectionFailModal
        closeEligibilityDetectionFailModal={() => {
          setShowEligibilityDetectionFailModal(false);
          dispatch(clearCreatePostFail());
        }}
        showEligibilityDetectionFailModal={showEligibilityDetectionFailModal}
        confirmationToken={confirmationToken}
      />

      {/* Modern, Glassmorphism-inspired Post Container */}
      <form onSubmit={handleSubmit} className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all hover:shadow-2xl">
        
        {/* Header Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

        <div className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">Create a Post in {communityName}</h2>
          </div>

          <div className="relative mb-6">
            <textarea
              className="peer w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
              name="content"
              id="content"
              value={formData.content}
              onChange={handleContentChange}
              minLength={10}
              maxLength={3000}
              rows="3"
              placeholder="What's on your mind? (Min 10 characters)"
              required
            />
          </div>

          {/* Media Preview or Drag/Drop Zone */}
          {formData.previewUrl ? (
            <div className="relative mb-6 overflow-hidden rounded-xl bg-gray-100 shadow-inner group">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {formData.fileType === "video" ? (
                <video src={formData.previewUrl} controls className="w-full max-h-[400px] object-contain rounded-xl" />
              ) : (
                <img src={formData.previewUrl} alt="Preview" className="w-full max-h-[400px] object-contain rounded-xl" />
              )}
            </div>
          ) : (
            <div className="mb-6">
              <label
                htmlFor="file"
                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-8 transition-all hover:border-indigo-400 hover:bg-indigo-50/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 transition-transform group-hover:scale-110 group-hover:bg-indigo-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="mt-3 font-semibold text-gray-700">Add an Image or Video</h3>
                <p className="mt-1 text-xs text-gray-500">Drag & drop or click to browse (Max 50MB)</p>
                <input
                  name="file"
                  type="file"
                  id="file"
                  accept="image/*, video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {formData.error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              {formData.error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              className={`flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${
                formData.loading || (!formData.content && !formData.file) ? "opacity-50 cursor-not-allowed hover:scale-100" : ""
              }`}
              type="submit"
              disabled={formData.loading || (!formData.content && !formData.file)}
            >
              {formData.loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  Post Now
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PostForm;
