/**
 * Mock Video Service
 * Provides sample video data and simulated API calls for testing
 * Replace with real API calls after backend integration
 */

const MOCK_VIDEOS = [
  {
    id: 'mock-1',
    user_id: 'user-1',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://via.placeholder.com/300x500?text=Big+Buck+Bunny',
    description: 'Beautiful nature video',
    duration: 596,
    size: 52428800,
    format: 'mp4',
    likes: 1234,
    comments: 45,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    linked_product_id: null,
    store_id: null,
  },
  {
    id: 'mock-2',
    user_id: 'user-2',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://via.placeholder.com/300x500?text=Elephant+Dream',
    description: 'Amazing 3D animation',
    duration: 654,
    size: 63000000,
    format: 'mp4',
    likes: 2456,
    comments: 89,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    linked_product_id: null,
    store_id: null,
  },
  {
    id: 'mock-3',
    user_id: 'user-3',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://via.placeholder.com/300x500?text=Fire+Show',
    description: 'Spectacular light show',
    duration: 308,
    size: 28571475,
    format: 'mp4',
    likes: 567,
    comments: 12,
    created_at: new Date().toISOString(),
    linked_product_id: null,
    store_id: null,
  },
];

/**
 * Simulates fetching all videos with optional filtering
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Array of video objects
 */
export const fetchAllVideos = async (options = {}) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  let videos = [...MOCK_VIDEOS];
  
  // Filter by user_id if provided
  if (options.user_id) {
    videos = videos.filter((v) => v.user_id === options.user_id);
  }
  
  // Sort by created_at (newest first)
  videos.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  
  return videos;
};

/**
 * Simulates fetching a single video by ID
 * @param {string} videoId - Video ID
 * @returns {Promise<Object|null>} Video object or null if not found
 */
export const fetchVideoById = async (videoId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return MOCK_VIDEOS.find((v) => v.id === videoId) || null;
};

/**
 * Simulates uploading a video (mock)
 * @param {Object} videoData - Video file and metadata
 * @returns {Promise<Object>} Uploaded video object
 */
export const uploadVideo = async (videoData) => {
  // Simulate upload with progress callback
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const newVideo = {
    id: `video-${Date.now()}`,
    user_id: videoData.user_id || 'user-1',
    video_url: `https://storage.example.com/videos/${Date.now()}.mp4`,
    thumbnail_url: videoData.thumbnail_url || 'https://via.placeholder.com/300x500?text=Uploaded',
    description: videoData.description || 'Uploaded video',
    duration: videoData.duration || 0,
    size: videoData.size || 0,
    format: videoData.format || 'mp4',
    likes: 0,
    comments: 0,
    created_at: new Date().toISOString(),
    linked_product_id: videoData.linked_product_id || null,
    store_id: videoData.store_id || null,
  };
  
  MOCK_VIDEOS.unshift(newVideo);
  return newVideo;
};

/**
 * Simulates liking a video
 * @param {string} videoId - Video ID
 * @returns {Promise<Object>} Updated video object
 */
export const likeVideo = async (videoId) => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  const video = MOCK_VIDEOS.find((v) => v.id === videoId);
  if (video) {
    video.likes += 1;
  }
  return video;
};

/**
 * Simulates adding a comment to a video
 * @param {string} videoId - Video ID
 * @param {string} comment - Comment text
 * @returns {Promise<Object>} Updated video object
 */
export const addComment = async (videoId, comment) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const video = MOCK_VIDEOS.find((v) => v.id === videoId);
  if (video) {
    video.comments += 1;
  }
  return video;
};

/**
 * Simulates deleting a video
 * @param {string} videoId - Video ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteVideo = async (videoId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const index = MOCK_VIDEOS.findIndex((v) => v.id === videoId);
  if (index !== -1) {
    MOCK_VIDEOS.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Simulates thumbnail generation
 * @param {string} videoPath - Local video file path
 * @returns {Promise<string>} Thumbnail URL
 */
export const generateThumbnail = async (videoPath) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  // Mock thumbnail generation
  return `https://via.placeholder.com/300x500?text=Thumbnail+${Math.random().toString(36).substr(2, 9)}`;
};

export default {
  fetchAllVideos,
  fetchVideoById,
  uploadVideo,
  likeVideo,
  addComment,
  deleteVideo,
  generateThumbnail,
};
