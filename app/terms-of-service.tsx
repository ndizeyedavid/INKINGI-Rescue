import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TermsOfService() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: January 15, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By accessing and using INKINGI Rescue ("the App"), you accept and
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Service Description</Text>
          <Text style={styles.paragraph}>
            INKINGI Rescue is an emergency response application that connects
            users with emergency services, allows reporting of incidents, and
            facilitates community safety awareness. The App provides:
          </Text>
          <Text style={styles.bulletPoint}>• Emergency SOS alerts</Text>
          <Text style={styles.bulletPoint}>• Location sharing with emergency services</Text>
          <Text style={styles.bulletPoint}>• Emergency contact notifications</Text>
          <Text style={styles.bulletPoint}>• Community incident reporting</Text>
          <Text style={styles.bulletPoint}>• Access to emergency hotlines</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
          <Text style={styles.paragraph}>You agree to:</Text>
          <Text style={styles.bulletPoint}>
            • Provide accurate and truthful information
          </Text>
          <Text style={styles.bulletPoint}>
            • Use the App only for legitimate emergency purposes
          </Text>
          <Text style={styles.bulletPoint}>
            • Not make false emergency reports
          </Text>
          <Text style={styles.bulletPoint}>
            • Keep your account credentials secure
          </Text>
          <Text style={styles.bulletPoint}>
            • Comply with all applicable laws and regulations
          </Text>
          <Text style={styles.bulletPoint}>
            • Not misuse or abuse the emergency services
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Prohibited Activities</Text>
          <Text style={styles.paragraph}>You must not:</Text>
          <Text style={styles.bulletPoint}>
            • Submit false or fraudulent emergency reports
          </Text>
          <Text style={styles.bulletPoint}>
            • Use the App to harass or threaten others
          </Text>
          <Text style={styles.bulletPoint}>
            • Attempt to gain unauthorized access to the App
          </Text>
          <Text style={styles.bulletPoint}>
            • Interfere with the proper functioning of the App
          </Text>
          <Text style={styles.bulletPoint}>
            • Use the App for any illegal purposes
          </Text>
          <Text style={styles.bulletPoint}>
            • Share your account with others
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Emergency Services</Text>
          <Text style={styles.paragraph}>
            While we strive to provide reliable emergency services, INKINGI
            Rescue is a facilitator and not a replacement for official emergency
            services. Response times and availability may vary. In critical
            situations, you should also call official emergency numbers (112,
            912) directly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Location Services</Text>
          <Text style={styles.paragraph}>
            By using the App, you consent to the collection and sharing of your
            location data with emergency services and your designated emergency
            contacts during active emergencies. Location accuracy depends on
            device capabilities and network conditions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            The App is provided "as is" without warranties of any kind. We do
            not guarantee uninterrupted or error-free service. We are not liable
            for delays, failures, or inaccuracies in emergency response.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            To the maximum extent permitted by law, INKINGI Rescue and its
            operators shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the App,
            including but not limited to delays in emergency response.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Account Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your account if you
            violate these Terms of Service, engage in fraudulent activity, or
            misuse emergency services. You may also delete your account at any
            time through the App settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Data and Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of the App is also governed by our Privacy Policy. By using
            the App, you consent to the collection, use, and sharing of your
            information as described in the Privacy Policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            All content, features, and functionality of the App are owned by
            INKINGI Rescue and are protected by copyright, trademark, and other
            intellectual property laws. You may not copy, modify, or distribute
            any part of the App without our permission.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may modify these Terms of Service at any time. We will notify you
            of significant changes through the App or via email. Continued use
            of the App after changes constitutes acceptance of the new terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms of Service are governed by the laws of the Republic of
            Rwanda. Any disputes arising from these terms shall be resolved in
            the courts of Rwanda.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Contact Information</Text>
          <Text style={styles.paragraph}>
            For questions about these Terms of Service, contact us at:
          </Text>
          <Text style={styles.bulletPoint}>Email: legal@inkingirescue.rw</Text>
          <Text style={styles.bulletPoint}>Phone: +250 788 000 000</Text>
          <Text style={styles.bulletPoint}>
            Address: KG 123 St, Kigali, Rwanda
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision shall be limited or eliminated to the
            minimum extent necessary, and the remaining provisions shall remain
            in full force and effect.
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
