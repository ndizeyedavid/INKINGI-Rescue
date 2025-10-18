import Header from "@/components/Header";
import SosButton from "@/components/SosButton";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const [isVolunteer, setIsVolunteer] = useState<boolean>(false);

  const toggleSwitch = () => {
    setIsVolunteer((isVolunteer) => !isVolunteer);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Header />

        <View style={styles.textContainer}>
          <Text style={styles.text}>Help is Just a click away!</Text>
          <Text style={styles.text}>
            Click <Text style={styles.boldText}>SOS Button</Text> to call for
            help
          </Text>
        </View>

        {/* Big sos button */}
        <SosButton />

        <View style={styles.volunteerContainer}>
          <Text style={styles.volunteerText}>Volunteer for help</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#e6491e" }}
            onValueChange={toggleSwitch}
            value={isVolunteer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    padding: 20,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  text: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    color: "#E6491E",
    fontWeight: "bold",
  },
  volunteerContainer: {
    backgroundColor: "white",
    marginTop: 74,
    marginHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  volunteerText: {},
});
