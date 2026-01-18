import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTheme } from './ThemeContext';

/**
 * VideoPreviewCard Component
 * Displays a video card with thumbnail, metadata, and action buttons
 * Used in feeds, lists, and video browsing screens
 */
const VideoPreviewCard = ({
  video,
  onLike,
  onComment,
  onShare,
  onDelete,
  onPress,
  isOwnVideo = false,
  likeCount = 0,
  commentCount = 0,
}) => {
  const { theme } = useTheme();
  const [liked, setLiked] = useState(false);

  // Format file size to human readable format
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Format duration to MM:SS
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    if (onLike) {
      onLike(video.id);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Video', 'Are you sure you want to delete this video?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (onDelete) {
            onDelete(video.id);
          }
        },
      },
    ]);
  };

  const backgroundColor = theme.dark ? '#2a2a2a' : '#f9f9f9';
  const textColor = theme.dark ? '#fff' : '#000';
  const secondaryTextColor = theme.dark ? '#aaa' : '#666';
  const borderColor = theme.dark ? '#333' : '#e0e0e0';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor, borderColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: video.thumbnail_url }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Duration Badge */}
        {video.duration > 0 && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              ⏱️ {formatDuration(video.duration)}
            </Text>
          </View>
        )}

        {/* Play Icon Overlay */}
        <View style={styles.playOverlay}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
      </View>

      {/* Metadata Container */}
      <View style={styles.metadataContainer}>
        {/* Title/Description */}
        <Text
          style={[styles.description, { color: textColor }]}
          numberOfLines={2}
        >
          {video.description || 'Untitled Video'}
        </Text>

        {/* Format & Size Info */}
        <View style={styles.infoRow}>
          <Text style={[styles.infoText, { color: secondaryTextColor }]}>
            🎬 {video.format?.toUpperCase() || 'MP4'}
          </Text>
          <Text style={[styles.infoText, { color: secondaryTextColor }]}>
            📊 {formatFileSize(video.size)}
          </Text>
        </View>

        {/* Timestamp */}
        <Text style={[styles.timestamp, { color: secondaryTextColor }]}>
          {formatDate(video.created_at)}
        </Text>

        {/* Engagement Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>❤️</Text>
            <Text style={[styles.statText, { color: textColor }]}>
              {liked ? video.likes + 1 : video.likes}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>💬</Text>
            <Text style={[styles.statText, { color: textColor }]}>
              {video.comments}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>👁️</Text>
            <Text style={[styles.statText, { color: textColor }]}>
              {video.views || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={[styles.actionRow, { borderColor }]}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={[styles.actionLabel, { color: textColor }]}>
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment && onComment(video.id)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={[styles.actionLabel, { color: textColor }]}>
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare && onShare(video.id)}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={[styles.actionLabel, { color: textColor }]}>
            Share
          </Text>
        </TouchableOpacity>

        {isOwnVideo && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={[styles.actionLabel, { color: '#FF3B30' }]}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playIcon: {
    fontSize: 48,
    opacity: 0.8,
  },
  metadataContainer: {
    padding: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
  },
  timestamp: {
    fontSize: 11,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});

export default VideoPreviewCard;
