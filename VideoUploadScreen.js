import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from './ThemeContext';
import * as mockVideoService from './services/mockVideoService';

const VIDEO_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const SUPPORTED_FORMATS = ['mp4', 'mov', 'webm'];
const MIME_TYPE_MAP = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
};

const VideoUploadScreen = ({ navigation, onVideoUploaded }) => {
  const { theme } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [description, setDescription] = useState('');

  /**
   * Pick a video from device gallery
   */
  const pickVideoFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const video = result.assets[0];
        await processSelectedVideo(video);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video: ' + error.message);
    }
  };

  /**
   * Process and validate selected video
   */
  const processSelectedVideo = async (video) => {
    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(video.uri);
      const fileSize = fileInfo.size;

      // Extract file format from MIME type
      const mimeType = video.type || 'video/mp4';
      const format = MIME_TYPE_MAP[mimeType] || 'mp4';

      // Validation
      if (fileSize > VIDEO_MAX_SIZE) {
        Alert.alert(
          'File Too Large',
          `Video must be under ${VIDEO_MAX_SIZE / (1024 * 1024)}MB. Your file is ${(fileSize / (1024 * 1024)).toFixed(2)}MB.`
        );
        return;
      }

      if (!SUPPORTED_FORMATS.includes(format)) {
        Alert.alert('Unsupported Format', `Please use MP4, MOV, or WebM format. Your file is ${format}.`);
        return;
      }

      // Store selected video info
      setSelectedVideo({
        uri: video.uri,
        filename: video.filename || `video-${Date.now()}.${format}`,
        size: fileSize,
        format: format,
        duration: video.duration || 0,
        type: mimeType,
      });

      setUploadProgress(0);
    } catch (error) {
      Alert.alert('Error', 'Failed to process video: ' + error.message);
    }
  };

  /**
   * Upload video to backend/Supabase
   */
  const handleUpload = async () => {
    if (!selectedVideo) {
      Alert.alert('Error', 'Please select a video first');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please add a video description');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      // Call mock upload service
      const uploadedVideo = await mockVideoService.uploadVideo({
        description: description,
        size: selectedVideo.size,
        format: selectedVideo.format,
        duration: selectedVideo.duration,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Success notification
      Alert.alert('Success', 'Video uploaded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedVideo(null);
            setDescription('');
            setUploadProgress(0);
            setUploading(false);

            // Callback to parent if provided
            if (onVideoUploaded) {
              onVideoUploaded(uploadedVideo);
            }

            // Navigate back
            if (navigation) {
              navigation.goBack();
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Upload Failed', error.message);
      setUpploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Format bytes to human readable size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * Format duration to MM:SS
   */
  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const backgroundColor = theme.dark ? '#1e1e1e' : '#fff';
  const textColor = theme.dark ? '#fff' : '#000';
  const borderColor = theme.dark ? '#333' : '#ddd';
  const buttonBg = theme.dark ? '#333' : '#f0f0f0';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <Text style={[styles.title, { color: textColor }]}>Upload Video</Text>
      <Text style={[styles.subtitle, { color: textColor }]}>
        Share your content with the TryEverything community
      </Text>

      {/* Select Video Button */}
      <TouchableOpacity
        style={[styles.selectButton, { borderColor }]}
        onPress={pickVideoFromGallery}
        disabled={uploading}
      >
        <Text style={[styles.selectButtonText, { color: textColor }]}>
          📹 Select Video from Gallery
        </Text>
      </TouchableOpacity>

      {/* Selected Video Info */}
      {selectedVideo && (
        <View style={[styles.videoInfoBox, { backgroundColor: buttonBg }]}>
          <Text style={[styles.videoInfoLabel, { color: textColor }]}>
            Selected Video:
          </Text>
          <Text style={[styles.videoInfoValue, { color: textColor }]}>
            📄 {selectedVideo.filename}
          </Text>
          <Text style={[styles.videoInfoValue, { color: textColor }]}>
            📊 {formatFileSize(selectedVideo.size)}
          </Text>
          <Text style={[styles.videoInfoValue, { color: textColor }]}>
            ⏱️ {formatDuration(selectedVideo.duration || 0)}
          </Text>
          <Text style={[styles.videoInfoValue, { color: textColor }]}>
            🎬 {selectedVideo.format.toUpperCase()}
          </Text>
        </View>
      )}

      {/* Description Input */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: textColor }]}>Description</Text>
        <View
          style={[
            styles.descriptionInput,
            { borderColor, backgroundColor: buttonBg },
          ]}
        >
          {/* React Native Text Input alternative for better control */}
          <Text style={[styles.inputHint, { color: textColor }]}>
            {description || 'Enter video description...'}
          </Text>
        </View>
        <Text style={[styles.charCount, { color: textColor }]}>
          {description.length} / 500 characters
        </Text>
      </View>

      {/* Upload Progress */}
      {uploading && (
        <View style={[styles.progressBox, { backgroundColor: buttonBg }]}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${uploadProgress}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: textColor }]}>
            Uploading: {Math.round(uploadProgress)}%
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.uploadButton,
            { opacity: uploading || !selectedVideo ? 0.5 : 1 },
          ]}
          onPress={handleUpload}
          disabled={uploading || !selectedVideo}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>🚀 Upload Video</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cancelButton, { borderColor }]}
          onPress={() => {
            setSelectedVideo(null);
            setDescription('');
            setUploadProgress(0);
            if (navigation) navigation.goBack();
          }}
          disabled={uploading}
        >
          <Text style={[styles.cancelButtonText, { color: textColor }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View style={[styles.infoBox, { backgroundColor: buttonBg }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>ℹ️ Info</Text>
        <Text style={[styles.infoText, { color: textColor }]}>
          • Supported formats: MP4, MOV, WebM{'\n'}
          • Max file size: 100MB{'\n'}
          • Keep videos under 10 minutes{'\n'}
          • Good lighting and clear audio recommended
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.7,
  },
  selectButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  videoInfoBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  videoInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoInfoValue: {
    fontSize: 13,
    marginVertical: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 14,
  },
  charCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  progressBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  progressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    borderRadius: 8,
    padding: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default VideoUploadScreen;
