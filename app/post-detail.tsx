import { useAuth } from "@/context/AuthContext";
import { postsApi } from "@/services/api/api.service";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "@/components/CustomAlert";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

export default function PostDetail() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    setAlertType(type);
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (postId) {
      fetchPostDetails();
      fetchComments();
      checkIfLikedLocally();
    }
  }, [postId]);

  const checkIfLikedLocally = async () => {
    try {
      const likedPosts = await AsyncStorage.getItem("likedPosts");
      if (likedPosts) {
        const likedPostsArray = JSON.parse(likedPosts);
        setIsLiked(likedPostsArray.includes(postId));
      }
    } catch (error) {
      console.error("Error checking liked posts:", error);
    }
  };

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const response = await postsApi.getById(postId);

      if (response.success && response.data) {
        setPost(response.data);
        setLikesCount(response.data._count.likes || 0);
        // Don't override local like state - it's managed by checkIfLikedLocally
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      showAlert("error", "Error", "Failed to load post details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await postsApi.getComments(postId);

      if (response.success && response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const getAuthorName = (userData: {
    firstName?: string;
    lastName?: string;
    name?: string;
  }): string => {
    if (userData.firstName && userData.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    return userData.name || userData.firstName || "Anonymous";
  };

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} • ${hours}:${minutes}`;
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await postsApi.createComment(postId, {
        content: comment.trim(),
      });

      if (response.success) {
        setComment("");
        await fetchComments();

        // Update comments count
        if (post) {
          setPost({ ...post, commentsCount: post.commentsCount + 1 });
        }
      } else {
        showAlert("error", "Error", response.error || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Comment error:", error);
      showAlert("error", "Error", "An error occurred while posting your comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleToggleLike = async () => {
    if (isTogglingLike) return;

    try {
      setIsTogglingLike(true);
      const previousLiked = isLiked;
      const previousCount = likesCount;

      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

      const response = await postsApi.like(postId);

      if (response.success) {
        // Save to local storage
        try {
          const likedPosts = await AsyncStorage.getItem("likedPosts");
          let likedPostsArray = likedPosts ? JSON.parse(likedPosts) : [];

          if (!isLiked) {
            // Add to liked posts
            if (!likedPostsArray.includes(postId)) {
              likedPostsArray.push(postId);
            }
          } else {
            // Remove from liked posts
            likedPostsArray = likedPostsArray.filter(
              (id: string) => id !== postId
            );
          }

          await AsyncStorage.setItem(
            "likedPosts",
            JSON.stringify(likedPostsArray)
          );
        } catch (storageError) {
          console.error("Error saving liked state:", storageError);
        }
      } else {
        // Revert on failure
        setIsLiked(previousLiked);
        setLikesCount(previousCount);
        showAlert("error", "Error", response.error || "Failed to update like.");
      }
    } catch (error) {
      console.error("Like error:", error);
      showAlert("error", "Error", "An error occurred while updating like.");
    } finally {
      setIsTogglingLike(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#e6491e" />
        <Text style={styles.loadingText}>Loading post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="document-text-outline" size={64} color="#cccccc" />
        <Text style={styles.emptyText}>Post not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color="#e6491e" />
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{getAuthorName(post.user)}</Text>
              <Text style={styles.postDate}>
                {formatDateTime(post.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Post Title */}
        <Text style={styles.postTitle}>{post.title}</Text>

        {/* Post Image */}
        {post.imageUrl && (
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.contentText}>{post.content}</Text>
        </View>

        {/* Post Stats */}
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={20} color="#e6491e" />
            <Text style={styles.statText}>
              {likesCount} {likesCount === 1 ? "like" : "likes"}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={20} color="#666666" />
            <Text style={styles.statText}>
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.7}
            onPress={handleToggleLike}
            disabled={isTogglingLike}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "#e6491e" : "#666666"}
            />
            <Text
              style={[styles.actionText, isLiked && styles.actionTextActive]}
            >
              Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={24} color="#666666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

          {comments.length === 0 ? (
            <Text style={styles.noCommentsText}>
              No comments yet. Be the first to comment!
            </Text>
          ) : (
            comments.map((commentItem) => (
              <View key={commentItem.id} style={styles.commentCard}>
                <View style={styles.commentAvatar}>
                  <Ionicons name="person" size={20} color="#e6491e" />
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>
                      {getAuthorName(commentItem.user)}
                    </Text>
                    <Text style={styles.commentDate}>
                      {formatTimeAgo(commentItem.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{commentItem.content}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <View style={styles.commentInputAvatar}>
          <Ionicons name="person" size={20} color="#e6491e" />
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          placeholderTextColor="#999999"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!comment.trim() || isSubmittingComment) &&
              styles.sendButtonDisabled,
          ]}
          activeOpacity={0.7}
          onPress={handlePostComment}
          disabled={!comment.trim() || isSubmittingComment}
        >
          {isSubmittingComment ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={comment.trim() ? "#ffffff" : "#cccccc"}
            />
          )}
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  authorDetails: {
    gap: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  postDate: {
    fontSize: 13,
    color: "#666666",
  },
  menuButton: {
    padding: 4,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
  },
  postImage: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
  },
  postContent: {
    padding: 16,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  contentText: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 24,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: "#666666",
  },
  actionButtons: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    borderBottomWidth: 8,
    borderBottomColor: "#f4f4f4",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666666",
  },
  commentsSection: {
    backgroundColor: "#ffffff",
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
  },
  commentCard: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
  },
  commentDate: {
    fontSize: 12,
    color: "#999999",
  },
  commentText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666666",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
    height: 80,
  },
  commentInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#000000",
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: 16,
  },
  actionTextActive: {
    color: "#e6491e",
  },
  noCommentsText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
});
