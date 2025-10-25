import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Suggestion {
  id: string;
  text: string;
  icon: string;
}

interface SuggestionPillsProps {
  suggestions: Suggestion[];
  onSuggestionPress: (text: string) => void;
  visible: boolean;
}

export default function SuggestionPills({
  suggestions,
  onSuggestionPress,
  visible,
}: SuggestionPillsProps) {
  if (!visible) return null;

  return (
    <View style={styles.suggestionsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContent}
      >
        {suggestions.map((suggestion) => (
          <TouchableOpacity
            key={suggestion.id}
            style={styles.suggestionPill}
            onPress={() => onSuggestionPress(suggestion.text)}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionsContainer: {
    paddingVertical: 12,
  },
  suggestionsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionPill: {
    backgroundColor: "#fff5f2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ffe5dd",
  },
  suggestionText: {
    fontSize: 14,
    color: "#e6491e",
    fontWeight: "600",
  },
});
