import type { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../lib/theme";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBar}>
            <Link href="/" asChild>
              <Pressable accessibilityRole="button" accessibilityLabel="Back to home">
                <Text style={styles.backLabel}>‹  Home</Text>
              </Pressable>
            </Link>
            <View style={styles.brandMark}>
              <Image
                accessibilityLabel="ST Ford"
                resizeMode="contain"
                source={require("../assets/images/full-logo.png")}
                style={styles.logo}
              />
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>ST FORD ALTERNATOR</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {children}
          </View>
          <Text style={styles.secureNote}>Your account details are kept secure.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  backLabel: {
    color: colors.muted,
    fontFamily: fonts.semibold,
    fontSize: 14,
    paddingVertical: 10,
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
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  heading: {
    marginBottom: 10,
  },
  eyebrow: {
    color: colors.brand,
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.25,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 28,
    letterSpacing: -0.9,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  secureNote: {
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
  },
});
