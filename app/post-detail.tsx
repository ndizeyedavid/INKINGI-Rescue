import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
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

interface Comment {
  id: number;
  author: string;
  avatar?: string;
  content: string;
  date: string;
  likes: number;
}

export default function PostDetail() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah Mukamana",
      content:
        "This is such an important initiative! I'll definitely be there to donate.",
      date: "2 hours ago",
      likes: 12,
    },
    {
      id: 2,
      author: "Jean Claude Niyonzima",
      content: "Great work! Can we also donate at other locations in the city?",
      date: "4 hours ago",
      likes: 8,
    },
    {
      id: 3,
      author: "Grace Uwase",
      content:
        "Thank you for organizing this. Every donation counts and saves lives!",
      date: "5 hours ago",
      likes: 15,
    },
  ]);

  const handlePostComment = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: "You",
        content: comment,
        date: "Just now",
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

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
              <Ionicons name="business" size={24} color="#e6491e" />
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>Rwanda Red Cross</Text>
              <Text style={styles.postDate}>20-01-25 • 10:30 AM</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Post Title */}
        <Text style={styles.postTitle}>Blood Donation Drive This Weekend</Text>

        {/* Post Image */}
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80",
          }}
          style={styles.postImage}
          resizeMode="cover"
        />

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.contentText}>
            Join us for a blood donation drive at King Faisal Hospital this
            Saturday from 9 AM - 4 PM. Your donation can save lives! Walk-ins
            welcome.
          </Text>
          <Text style={styles.contentText}>
            We are in urgent need of all blood types, especially O- and AB+.
            Each donation can help save up to three lives.
          </Text>
          <Text style={styles.contentText}>
            Requirements:{"\n"}• Age 18-65 years{"\n"}• Weight at least 50kg
            {"\n"}• Good health condition{"\n"}• Valid ID
          </Text>
          <Text style={styles.contentText}>
            For more information, contact us at +250 788 123 456 or visit our
            website.
          </Text>
        </View>

        {/* Post Stats */}
        <View style={styles.postStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={20} color="#e6491e" />
            <Text style={styles.statText}>248 likes</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={20} color="#666666" />
            <Text style={styles.statText}>{comments.length} comments</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="share-social" size={20} color="#666666" />
            <Text style={styles.statText}>32 shares</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="heart-outline" size={24} color="#666666" />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="chatbubble-outline" size={24} color="#666666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={24} color="#666666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>

          {comments.map((commentItem) => (
            <View key={commentItem.id} style={styles.commentCard}>
              <View style={styles.commentAvatar}>
                <Ionicons name="person" size={20} color="#e6491e" />
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{commentItem.author}</Text>
                  <Text style={styles.commentDate}>{commentItem.date}</Text>
                </View>
                <Text style={styles.commentText}>{commentItem.content}</Text>
                <View style={styles.commentActions}>
                  <TouchableOpacity
                    style={styles.commentAction}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="heart-outline" size={16} color="#666666" />
                    <Text style={styles.commentActionText}>
                      {commentItem.likes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.commentAction}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.commentActionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
            !comment.trim() && styles.sendButtonDisabled,
          ]}
          activeOpacity={0.7}
          onPress={handlePostComment}
          disabled={!comment.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={comment.trim() ? "#ffffff" : "#cccccc"}
          />
        </TouchableOpacity>
      </View>
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
});
