# 🎬 Video Upload - Integration Points

Quick reference for where to add VideoUploadScreen access in the UI.

## How to Access VideoUploadScreen

### Option 1: Via BottomNavBar (Recommended)
Add a new tab to navigate to video upload:

**File**: `BottomNavBar.js`
```javascript
// Add this to the tab list
<TouchableOpacity onPress={() => onNavigate('uploadVideo')}>
  <Icon name="videocam" />
  <Text>Upload</Text>
</TouchableOpacity>
```

### Option 2: Via FeedScreen Header Button
Add upload button to FeedScreen header:

**File**: `FeedScreen.js`
```javascript
// In header section
<TouchableOpacity onPress={() => navigation.navigate('uploadVideo')}>
  <Ionicons name="cloud-upload" size={24} />
</TouchableOpacity>
```

### Option 3: Via ProfileScreen Menu
Add upload option to user profile:

**File**: `ProfileScreen.js`
```javascript
<TouchableOpacity onPress={() => setActiveScreen('uploadVideo')}>
  <Text>Upload Video</Text>
</TouchableOpacity>
```

### Option 4: Via Floating Action Button
Add FAB in FeedScreen:

**File**: `FeedScreen.js`
```javascript
<TouchableOpacity 
  style={styles.fab}
  onPress={() => setActiveScreen('uploadVideo')}
>
  <Text style={styles.fabIcon}>+</Text>
</TouchableOpacity>
```

---

## Component Integration

### VideoUploadScreen Props
```javascript
<VideoUploadScreen 
  navigation={{
    goBack: () => setActiveScreen('feed')
  }}
  onVideoUploaded={(video) => {
    // Callback when upload completes
    setActiveScreen('feed');
  }}
/>
```

### VideoPreviewCard Props
```javascript
<VideoPreviewCard
  video={videoObject}
  onLike={(videoId) => console.log('Liked:', videoId)}
  onComment={(videoId) => console.log('Comment:', videoId)}
  onShare={(videoId) => console.log('Share:', videoId)}
  onDelete={(videoId) => console.log('Delete:', videoId)}
  onPress={() => console.log('Tap video')}
  isOwnVideo={true}  // Shows delete button
/>
```

---

## Current Navigation Routes

In `App.js` renderContent():

```javascript
case 'uploadVideo':
  return <VideoUploadScreen 
    navigation={{ goBack: () => setActiveScreen('feed') }}
    onVideoUploaded={() => setActiveScreen('feed')}
  />;
```

To navigate to upload screen:
```javascript
setActiveScreen('uploadVideo');
```

---

## Testing Video Features

### Test 1: Watch Videos
1. Open app
2. Feed auto-displays 3 sample videos
3. Tap video → native player opens
4. Use play/pause, seek bar, volume
5. Swipe up/down to scroll between videos

### Test 2: Like Videos
1. Tap ❤️ button on video
2. Heart fills in red
3. Like count increases
4. Works for multiple videos

### Test 3: Upload UI
1. Navigate to VideoUploadScreen
2. Tap "Select Video from Gallery"
3. Pick a video from phone
4. Add description
5. Tap "Upload Video"
6. Watch progress bar
7. See success alert

### Test 4: Validation
1. Try selecting file > 100MB → Error alert
2. Try unsupported format → Error alert
3. Try uploading without description → Error alert
4. Try without video selected → Error alert

---

## Mock Data Reference

The mock service provides these 3 videos:

**Video 1: Big Buck Bunny**
- URL: Google test video library
- Format: MP4
- Duration: 596 seconds (~10 min)
- Size: ~50MB
- Likes: 1234

**Video 2: Elephant Dream**
- URL: Google test video library
- Format: MP4
- Duration: 654 seconds (~11 min)
- Size: ~63MB
- Likes: 2456

**Video 3: For Bigger Blazes**
- URL: Google test video library
- Format: MP4
- Duration: 308 seconds (~5 min)
- Size: ~28MB
- Likes: 567

---

## Component Dependencies

### VideoUploadScreen requires:
- ✅ `expo-image-picker` (already in package.json)
- ✅ `expo-file-system` (added in package.json)
- ✅ `ThemeContext` (existing)
- ✅ `mockVideoService` (created)

### VideoPreviewCard requires:
- ✅ `ThemeContext` (existing)
- ✅ `expo-video` (added in package.json)

### FeedScreen requires:
- ✅ `expo-video` (added in package.json)
- ✅ `mockVideoService` (created)
- ✅ `ThemeContext` (existing)
- ✅ `DataContext` (existing)

---

## State Management

### VideoUploadScreen State
```javascript
const [selectedVideo, setSelectedVideo] = useState(null);
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [description, setDescription] = useState('');
```

### FeedScreen State
```javascript
const [videoList, setVideoList] = useState([]);
const [loading, setLoading] = useState(true);
```

---

## Error Handling

### File Validation Errors
- "File Too Large": Shows if > 100MB
- "Unsupported Format": Shows if not MP4/MOV/WebM
- "Failed to pick video": Shows if permission denied

### Upload Errors
- "Please select a video first"
- "Please add a video description"
- Network errors (handled in Phase 2)

---

## API Integration (Phase 2)

Once backend is ready, replace this in VideoUploadScreen:
```javascript
// Current (Phase 1)
const uploadedVideo = await mockVideoService.uploadVideo({...});

// Future (Phase 2)
const response = await fetch('https://tryeverything-backend.vercel.app/api/videos/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  },
  body: formData
});
```

---

## Styling Customization

### Colors (in components)
- Primary: `#007AFF` (blue upload button)
- Success: `#34C759` (like button)
- Danger: `#FF3B30` (delete button)
- Background: Theme-aware (dark/light)

### Spacing
- Card padding: 12px
- Button height: 44px minimum
- Text sizes: 12-24px range

### Theme Variables (from ThemeContext)
```javascript
theme = {
  background: '#fff' or '#1e1e1e',
  text: '#000' or '#fff',
  textSecondary: '#666' or '#aaa',
  card: light/dark variant,
  border: light/dark variant
}
```

---

## Performance Considerations

- Mock service simulates 200-600ms delays
- Video list limited to 3 for testing (scale in Phase 2)
- Components use React.memo for optimization (add if needed)
- No unnecessary re-renders with proper dependency arrays

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Videos don't play | Check expo-video installed |
| Upload not accessible | Add navigation route in BottomNavBar |
| Theme not applied | Verify ThemeProvider wraps components |
| Gallery picker fails | Check permissions in app settings |
| File size validation fails | Ensure FileSystem operations async/await |

---

**Ready to integrate!** 🚀

Next: Add upload button to UI and test full flow in Expo Go.
