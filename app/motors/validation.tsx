import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getCurrentUser,
  getErrorMessage,
  validateAlternator,
  type EngineDetails,
  type User,
} from "../../lib/api";
import { clearToken, getToken } from "../../lib/session";
import { colors, fonts } from "../../lib/theme";

export default function ValidationScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [engine, setEngine] = useState<(EngineDetails & { serial_no: string }) | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const savedToken = await getToken();
        if (!savedToken) {
          if (active) router.replace("/users/login");
          return;
        }
        const result = await getCurrentUser(savedToken);
        if (!result.success || !result.user) {
          throw new Error(result.msg ?? "Your session could not be verified. Please sign in again.");
        }
        if (active) {
          setToken(savedToken);
          setUser(result.user);
        }
      } catch (error) {
        if (active) {
          Alert.alert("Unable to load account", getErrorMessage(error));
          router.replace("/");
        }
      } finally {
        if (active) setLoadingUser(false);
      }
    };

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const submit = async () => {
    const serial = serialNumber.trim().toUpperCase();
    if (!serial) {
      setErrorMessage("Enter your alternator serial number to continue.");
      return;
    }
    if (!user || !token) {
      setErrorMessage("Sign in to verify an alternator.");
      return;
    }

    setValidating(true);
    setErrorMessage("");
    setEngine(null);
    try {
      const result = await validateAlternator(serial, token);
      if (!result.success || !result.engine) {
        setErrorMessage(result.msg ?? "We couldn't find an alternator with that serial number.");
        return;
      }
      setEngine({
        ...result.engine,
        serial_no: serial,
        model: result.engine.model ?? "",
        engine_name: result.engine.engine_name ?? "",
        location: result.engine.location ?? "",
      });
      setSerialNumber("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setValidating(false);
    }
  };

  if (loadingUser) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.loadingScreen}>
          <View style={styles.loadingMark}>
            <ActivityIndicator color={colors.brand} size="large" />
          </View>
          <Text style={styles.loadingText}>Getting your account ready…</Text>
        </SafeAreaView>
      </>
    );
  }

  const firstName = user?.name.trim().split(/\s+/)[0] || "there";

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.brandMark}>
              <Image
                accessibilityLabel="ST Ford"
                resizeMode="contain"
                source={require("../../assets/images/full-logo.png")}
                style={styles.logo}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={async () => {
                try {
                  await clearToken();
                  router.replace("/");
                } catch (error) {
                  Alert.alert("Sign out error", getErrorMessage(error));
                }
              }}
              style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}
            >
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          </View>

          <View style={styles.welcome}>
            <Text style={styles.eyebrow}>YOUR ST FORD ACCOUNT</Text>
            <Text style={styles.title}>Good to see you, {firstName}.</Text>
            <Text style={styles.subtitle}>
              Find the details behind your alternator.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionIconText}>01</Text>
              </View>
              <View style={styles.sectionCopy}>
                <Text style={styles.cardTitle}>Serial number lookup</Text>
                <Text style={styles.cardSubtitle}>Your product, identified.</Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Alternator serial number</Text>
            <TextInput
              accessibilityLabel="Alternator serial number"
              accessibilityHint="Enter the serial printed on your alternator"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={10}
              onChangeText={(value) => {
                setSerialNumber(value);
                if (errorMessage) setErrorMessage("");
              }}
              onSubmitEditing={submit}
              placeholder="e.g. PJ1234U123"
              placeholderTextColor={colors.muted}
              returnKeyType="search"
              selectionColor={colors.brand}
              style={styles.input}
              value={serialNumber}
            />
            <Text style={styles.helper}>Usually printed on the alternator label.</Text>

            {errorMessage ? (
              <View accessibilityLiveRegion="polite" style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: validating, busy: validating }}
              disabled={validating}
              onPress={submit}
              style={({ pressed }) => [
                styles.validateButton,
                pressed && !validating && styles.pressed,
                validating && styles.disabled,
              ]}
            >
              {validating ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Text style={styles.validateButtonText}>Find my alternator</Text>
                  <Text style={styles.buttonArrow}>→</Text>
                </>
              )}
            </Pressable>
            <Text style={styles.privacyNote}>Your lookup is private to your account.</Text>
          </View>

          {engine ? (
            <View accessibilityLiveRegion="polite" style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.successBadge}>
                  <Text style={styles.successCheck}>✓</Text>
                  <Text style={styles.successText}>VERIFIED</Text>
                </View>
                <Text style={styles.resultHeading}>Alternator details</Text>
              </View>
              <View style={styles.productPanel}>
                <Image
                  accessibilityLabel="ST Ford alternator"
                  resizeMode="contain"
                  source={require("../../assets/images/alternator.png")}
                  style={styles.alternator}
                />
                <Text style={styles.productName}>{engine.model || "ST Ford Alternator"}</Text>
              </View>
              <ResultRow label="Serial number" value={engine.serial_no} />
              <ResultRow label="Model" value={engine.model} />
              <ResultRow label="Build year" value={engine.engine_name} />
              <ResultRow label="Location" value={engine.location} last />
            </View>
          ) : (
            <View style={styles.tip}>
              <View style={styles.tipMark}>
                <Text style={styles.tipMarkText}>i</Text>
              </View>
              <Text style={styles.tipText}>
                Enter the full serial number exactly as it appears on your product.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function ResultRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.resultRow, last && styles.lastResultRow]}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loadingScreen: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
  loadingMark: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 22,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  loadingText: {
    color: colors.muted,
    fontFamily: fonts.medium,
    fontSize: 14,
    marginTop: 16,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 30,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brandMark: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 11,
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 11,
  },
  logo: {
    height: 22,
    width: 110,
  },
  signOut: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  signOutText: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  welcome: {
    marginBottom: 22,
    marginTop: 30,
  },
  eyebrow: {
    color: colors.brand,
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.extraBold,
    fontSize: 25,
    letterSpacing: -0.8,
    lineHeight: 33,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 14,
    marginTop: 5,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
  },
  sectionHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  sectionIcon: {
    alignItems: "center",
    backgroundColor: colors.softBrand,
    borderRadius: 13,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sectionIconText: {
    color: colors.brand,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  sectionCopy: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  cardSubtitle: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 12,
    marginTop: 3,
  },
  inputLabel: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 15,
    letterSpacing: 0.3,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  helper: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 11,
    marginTop: 7,
  },
  errorBox: {
    backgroundColor: colors.softBrand,
    borderRadius: 10,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: colors.brandDark,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  validateButton: {
    alignItems: "center",
    backgroundColor: colors.brand,
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    minHeight: 54,
    paddingHorizontal: 18,
  },
  validateButtonText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  buttonArrow: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 19,
    marginLeft: 9,
    marginTop: -2,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.68,
  },
  privacyNote: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 10,
    marginTop: 13,
    textAlign: "center",
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 18,
    overflow: "hidden",
    paddingHorizontal: 17,
    paddingTop: 17,
  },
  resultHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  successBadge: {
    alignItems: "center",
    backgroundColor: colors.softSuccess,
    borderRadius: 20,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  successCheck: {
    color: colors.success,
    fontFamily: fonts.bold,
    fontSize: 11,
  },
  successText: {
    color: colors.success,
    fontFamily: fonts.bold,
    fontSize: 9,
    letterSpacing: 0.7,
  },
  resultHeading: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  productPanel: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 15,
    marginTop: 14,
    padding: 8,
  },
  alternator: {
    height: 112,
    width: 160,
  },
  productName: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 13,
    marginBottom: 10,
    marginTop: -2,
  },
  resultRow: {
    alignItems: "center",
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 49,
    paddingVertical: 11,
  },
  lastResultRow: {
    borderBottomWidth: 0,
  },
  resultLabel: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  resultValue: {
    color: colors.text,
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 12,
    textAlign: "right",
  },
  tip: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 17,
    paddingHorizontal: 3,
  },
  tipMark: {
    alignItems: "center",
    backgroundColor: "#E9EDF2",
    borderRadius: 9,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  tipMarkText: {
    color: colors.muted,
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  tipText: {
    color: colors.muted,
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 17,
  },
});
