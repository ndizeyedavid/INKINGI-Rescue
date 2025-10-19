import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ICommunityPostCard {
  author: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  onMenuPress?: () => void;
}

export default function CommunityPostCard({
  author,
  date,
  title,
  content,
  imageUrl,
  onMenuPress,
}: ICommunityPostCard) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => router.push("/post-detail")}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorText}>{author}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
        {onMenuPress && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onMenuPress();
            }}
            style={styles.menuButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#666666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Image */}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.contentText}>{content}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: "#999999",
    fontWeight: "400",
  },
  menuButton: {
    padding: 4,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    lineHeight: 20,
  },
  contentText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
