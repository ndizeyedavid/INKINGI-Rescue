import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicy() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: January 15, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to INKINGI Rescue ("we," "our," or "us"). We are committed
            to protecting your privacy and ensuring the security of your
            personal information. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            emergency response mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.subTitle}>2.1 Personal Information</Text>
          <Text style={styles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={styles.bulletPoint}>• Name and contact information</Text>
          <Text style={styles.bulletPoint}>• Email address and phone number</Text>
          <Text style={styles.bulletPoint}>• Emergency contact details</Text>
          <Text style={styles.bulletPoint}>• Blood type and medical information</Text>
          <Text style={styles.bulletPoint}>• Profile photo (optional)</Text>

          <Text style={styles.subTitle}>2.2 Location Data</Text>
          <Text style={styles.paragraph}>
            We collect precise location data to provide emergency services. This
            includes GPS coordinates, which are essential for dispatching help
            to your exact location during emergencies.
          </Text>

          <Text style={styles.subTitle}>2.3 Device Information</Text>
          <Text style={styles.paragraph}>
            We automatically collect certain information about your device,
            including device type, operating system, unique device identifiers,
            and mobile network information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>We use your information to:</Text>
          <Text style={styles.bulletPoint}>
            • Provide emergency response services
          </Text>
          <Text style={styles.bulletPoint}>
            • Share your location with emergency services
          </Text>
          <Text style={styles.bulletPoint}>
            • Notify your emergency contacts during crises
          </Text>
          <Text style={styles.bulletPoint}>
            • Send critical safety alerts and notifications
          </Text>
          <Text style={styles.bulletPoint}>
            • Improve our services and user experience
          </Text>
          <Text style={styles.bulletPoint}>
            • Comply with legal obligations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We may share your information with:
          </Text>
          <Text style={styles.bulletPoint}>
            • Emergency services (police, ambulance, fire department)
          </Text>
          <Text style={styles.bulletPoint}>
            • Your designated emergency contacts
          </Text>
          <Text style={styles.bulletPoint}>
            • Healthcare providers during medical emergencies
          </Text>
          <Text style={styles.bulletPoint}>
            • Law enforcement when legally required
          </Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information to third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet is 100% secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>
            • Access your personal information
          </Text>
          <Text style={styles.bulletPoint}>
            • Correct inaccurate information
          </Text>
          <Text style={styles.bulletPoint}>• Delete your account and data</Text>
          <Text style={styles.bulletPoint}>
            • Opt-out of non-essential communications
          </Text>
          <Text style={styles.bulletPoint}>
            • Withdraw consent for data processing
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to
            provide our services and comply with legal obligations. Emergency
            incident data may be retained for legal and safety purposes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our service is not intended for children under 13 years of age. We
            do not knowingly collect personal information from children under 13.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this Privacy Policy, please contact us
            at:
          </Text>
          <Text style={styles.bulletPoint}>Email: privacy@inkingirescue.rw</Text>
          <Text style={styles.bulletPoint}>Phone: +250 788 000 000</Text>
          <Text style={styles.bulletPoint}>
            Address: KG 123 St, Kigali, Rwanda
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 24,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 8,
  },
});
