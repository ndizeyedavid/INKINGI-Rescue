import { StyleSheet, Text, View } from "react-native";

interface IPageHeader {
  title: string;
}

export default function PageHeader({ title }: IPageHeader) {
  return (
    <View style={styles.headerContainer}>
      <View className="ml-4">
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
  },
});
