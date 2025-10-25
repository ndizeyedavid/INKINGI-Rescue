import CommunityPostCard from "@/components/CommunityPostCard";
import CustomAlert from "@/components/CustomAlert";
import PageHeader from "@/components/pageHeader";
import { useAuth } from "@/context/AuthContext";
import { postsApi } from "@/services/api/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
}

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
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
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsApi.getAll();

      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      showAlert("error", "Error", "Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const getAuthorName = (post: Post): string => {
    if (post.user.firstName && post.user.lastName) {
      return `${post.user.firstName} ${post.user.lastName}`;
    }
    return post.user.name || post.user.firstName || "Anonymous";
  };

  const handleDeletePost = async (postId: string) => {
    // Show confirmation alert
    showAlert(
      "warning",
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    // Note: For now, we'll need to implement a confirmation dialog
    // For immediate deletion without confirmation:
    try {
      const response = await postsApi.delete(postId);
      if (response.success) {
        setPosts(posts.filter((p) => p.id !== postId));
        showAlert("success", "Success", "Post deleted successfully!");
      } else {
        showAlert("error", "Error", response.error || "Failed to delete post.");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      showAlert("error", "Error", "An error occurred while deleting the post.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title={"Community"} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e6491e" />
          <Text style={styles.loadingText}>Loading posts...</Text>
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>
            Be the first to share something with the community!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#e6491e"]} // Android
              tintColor="#e6491e" // iOS
            />
          }
        >
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              id={post.id}
              author={getAuthorName(post)}
              date={formatDate(post.createdAt)}
              title={post.title}
              content={post.content}
              imageUrl={post.imageUrl}
              onMenuPress={
                user && user.id === post.user.id
                  ? () => handleDeletePost(post.id)
                  : undefined
              }
            />
          ))}
        </ScrollView>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push("/new-post")}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
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
    padding: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999999",
    marginTop: 8,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 110,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
