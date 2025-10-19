import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function About() {
  const handleEmail = () => {
    Linking.openURL("mailto:info@inkingirescue.rw");
  };

  const handlePhone = () => {
    Linking.openURL("tel:+250788000000");
  };

  const handleWebsite = () => {
    Linking.openURL("https://inkingirescue.rw");
  };

  const handleSocialMedia = (platform: string) => {
    const urls: { [key: string]: string } = {
      facebook: "https://facebook.com/inkingirescue",
      twitter: "https://twitter.com/inkingirescue",
      instagram: "https://instagram.com/inkingirescue",
      linkedin: "https://linkedin.com/company/inkingirescue",
    };
    Linking.openURL(urls[platform]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            {/* <Ionicons name="shield-checkmark" size={64} color="#ffffff" /> */}
            <Image source={require("@/assets/images/logo.png")} />
          </View>
          <Text style={styles.appName}>INKINGI Rescue</Text>
          <Text style={styles.version}>Version 1.0 Alpha</Text>
        </View>

        {/* Mission Statement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.paragraph}>
            INKINGI Rescue is dedicated to saving lives by providing fast,
            reliable emergency response services across Rwanda. We connect
            citizens with emergency services, enable community safety awareness,
            and empower individuals to help each other in times of crisis.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="alert-circle" size={24} color="#e6491e" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Emergency SOS</Text>
                <Text style={styles.featureDescription}>
                  Quick access to emergency services with one tap
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="location" size={24} color="#e6491e" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Location Sharing</Text>
                <Text style={styles.featureDescription}>
                  Automatically share your location during emergencies
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="people" size={24} color="#e6491e" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Community Alerts</Text>
                <Text style={styles.featureDescription}>
                  Stay informed about incidents in your area
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="call" size={24} color="#e6491e" />
              </View>
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>Emergency Hotlines</Text>
                <Text style={styles.featureDescription}>
                  Direct access to police, ambulance, and fire services
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity
            style={styles.contactItem}
            activeOpacity={0.7}
            onPress={handleEmail}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="mail" size={20} color="#e6491e" />
            </View>
            <Text style={styles.contactText}>info@inkingirescue.rw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            activeOpacity={0.7}
            onPress={handlePhone}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="call" size={20} color="#e6491e" />
            </View>
            <Text style={styles.contactText}>+250 788 000 000</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactItem}
            activeOpacity={0.7}
            onPress={handleWebsite}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="globe" size={20} color="#e6491e" />
            </View>
            <Text style={styles.contactText}>www.inkingirescue.rw</Text>
          </TouchableOpacity>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Ionicons name="location" size={20} color="#e6491e" />
            </View>
            <Text style={styles.contactText}>KG 123 St, Kigali, Rwanda</Text>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => handleSocialMedia("facebook")}
            >
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => handleSocialMedia("twitter")}
            >
              <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => handleSocialMedia("instagram")}
            >
              <Ionicons name="logo-instagram" size={28} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => handleSocialMedia("linkedin")}
            >
              <Ionicons name="logo-linkedin" size={28} color="#0A66C2" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Team/Credits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.paragraph}>
            INKINGI Rescue is developed and maintained by a dedicated team of
            developers, emergency response professionals, and community safety
            advocates committed to making Rwanda safer for everyone.
          </Text>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            2025 INKINGI Rescue. All rights reserved.
          </Text>
          <Text style={styles.legalText}>Made with in Rwanda</Text>
        </View>
      </ScrollView>
    </View>
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
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 20,
  },
  logo: {
    // backgroundColor: "#e6491e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: "#666666",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
  },
  contactText: {
    fontSize: 15,
    color: "#000000",
    flex: 1,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  legalSection: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 20,
  },
  legalText: {
    fontSize: 13,
    color: "#999999",
    marginBottom: 4,
  },
});
