import { Link } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, fonts } from "../lib/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <Image
              accessibilityLabel="ST Ford"
              resizeMode="contain"
              source={require("../assets/images/full-logo.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.status}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>GENUINE PARTS</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>ST FORD ALTERNATOR CARE</Text>
            <Text style={styles.title}>Know what{"\n"}keeps you moving.</Text>
            <Text style={styles.subtitle}>
              Get trusted details for your alternator, in seconds.
            </Text>
          </View>
          <View style={styles.imageGlow}>
            <Image
              accessibilityLabel="ST Ford alternator"
              resizeMode="contain"
              source={require("../assets/images/alternator.png")}
              style={styles.alternator}
            />
          </View>
          <View style={styles.heroFoot}>
            <View style={styles.heroRule} />
            <Text style={styles.heroFootText}>BUILT FOR CONFIDENCE</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.sectionTitle}>Your alternator, verified.</Text>
          <Text style={styles.sectionSubtitle}>
            Look up product information with your unique serial number.
          </Text>
        </View>

        <View style={styles.actions}>
          <Link href="/users/register" asChild>
            <PrimaryButton label="Create your account" onPress={() => {}} />
          </Link>
          <View style={styles.loginPrompt}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Link href="/users/login" asChild>
              <Pressable accessibilityRole="link" hitSlop={8}>
                <Text style={styles.loginLink}>Log in</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.trustNote}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>✓</Text>
          </View>
          <Text style={styles.trustText}>Fast, reliable product verification</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  logo: {
    height: 23,
    width: 116,
  },
  status: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  statusDot: {
    backgroundColor: colors.success,
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  statusText: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.65,
  },
  hero: {
    backgroundColor: colors.navy,
    borderRadius: 26,
    minHeight: 286,
    overflow: "hidden",
    padding: 23,
    position: "relative",
  },
  heroCopy: {
    maxWidth: "68%",
    zIndex: 1,
  },
  eyebrow: {
    color: "#F2A4B2",
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1.15,
    marginBottom: 13,
  },
  title: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 29,
    letterSpacing: -1.2,
    lineHeight: 35,
  },
  subtitle: {
    color: "#D3D9E1",
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 11,
    maxWidth: 210,
  },
  imageGlow: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.09)",
    borderRadius: 70,
    height: 136,
    justifyContent: "center",
    position: "absolute",
    right: -15,
    top: 71,
    width: 136,
  },
  alternator: {
    height: 120,
    width: 120,
  },
  heroFoot: {
    alignItems: "center",
    bottom: 22,
    flexDirection: "row",
    gap: 9,
    left: 23,
    position: "absolute",
  },
  heroRule: {
    backgroundColor: colors.brand,
    borderRadius: 2,
    height: 3,
    width: 24,
  },
  heroFootText: {
    color: "#D3D9E1",
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 1,
  },
  intro: {
    marginTop: 27,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 19,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 5,
  },
  actions: {
    marginTop: 16,
  },
  loginPrompt: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    marginTop: 18,
  },
  loginText: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  loginLink: {
    color: colors.brand,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  trustNote: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    marginTop: 30,
  },
  checkCircle: {
    alignItems: "center",
    backgroundColor: colors.softSuccess,
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  check: {
    color: colors.success,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  trustText: {
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 11,
  },
});
