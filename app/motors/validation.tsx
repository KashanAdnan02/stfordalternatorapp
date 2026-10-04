import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getCurrentUser, getErrorMessage, validateAlternator, type EngineDetails, type User } from "../../lib/api";
import { clearToken, getToken } from "../../lib/session";
import { colors } from "../../lib/theme";

export default function ValidationScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [engine, setEngine] = useState<(EngineDetails & { serial_no: string }) | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const token = await getToken();
        if (!token) {
          if (active) router.replace("/users/login");
          return;
        }
        const result = await getCurrentUser(token);
        if (!result.success || !result.user) {
          throw new Error(result.msg ?? "Your session could not be verified. Please sign in again.");
        }
        if (active) setUser(result.user);
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
      Alert.alert("Alternator Serial Number", "Please fill the serial number.");
      return;
    }
    if (!user) {
      Alert.alert("Account required", "Sign in before validating an alternator.");
      return;
    }

    setValidating(true);
    setEngine(null);
    try {
      const result = await validateAlternator(serial, user.name);
      if (!result.success || !result.engine) {
        Alert.alert("Alternator Serial No Error", result.msg ?? "No alternator was found.");
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
      Alert.alert("Alternator Serial No Error", getErrorMessage(error));
    } finally {
      setValidating(false);
    }
  };

  if (loadingUser) {
    return (
      <>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.loadingScreen}>
          <ActivityIndicator color={colors.brand} size="large" />
          <Text style={styles.loadingText}>Loading your account…</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image
              accessibilityLabel="ST Ford"
              resizeMode="contain"
              source={require("../../assets/images/full-logo.png")}
              style={styles.logo}
            />
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
              style={styles.signOut}
            >
              <Text style={styles.signOutText}>Sign out</Text>
            </Pressable>
          </View>

          <Text style={styles.title}>Validate an alternator</Text>
          <View style={styles.formCard}>
            <Text style={styles.description}>
              Enter a ST Ford Alternator serial number to validate its status.
            </Text>
            <TextInput
              accessibilityLabel="Alternator serial number"
              autoCapitalize="characters"
              maxLength={10}
              onChangeText={setSerialNumber}
              placeholder="eg: PJ1234U123"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={serialNumber}
            />
            <Pressable
              accessibilityRole="button"
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
                <Text style={styles.validateButtonText}>Validate</Text>
              )}
            </Pressable>
          </View>

          {engine ? (
            <View style={styles.resultCard}>
              <Image
                accessibilityLabel="Alternator"
                resizeMode="contain"
                source={require("../../assets/images/alternator.png")}
                style={styles.alternator}
              />
              <ResultRow label="Serial No" value={engine.serial_no} />
              <ResultRow label="Model Name" value={engine.model} />
              <ResultRow label="Build Year" value={engine.engine_name} />
              <ResultRow label="Location" value={engine.location} last />
            </View>
          ) : null}
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
  loadingText: {
    color: colors.muted,
    marginTop: 12,
  },
  content: {
    padding: 22,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  logo: {
    backgroundColor: colors.brand,
    borderRadius: 5,
    height: 42,
    width: 126,
  },
  signOut: {
    padding: 8,
  },
  signOutText: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "600",
    marginBottom: 14,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 3,
    padding: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  description: {
    color: colors.brand,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 12,
  },
  input: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  validateButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.brand,
    borderRadius: 4,
    justifyContent: "center",
    marginTop: 18,
    minHeight: 46,
    minWidth: 120,
    paddingHorizontal: 18,
  },
  validateButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.75,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 2,
    marginTop: 18,
    overflow: "hidden",
    paddingHorizontal: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  alternator: {
    alignSelf: "center",
    height: 140,
    marginVertical: 12,
    width: 180,
  },
  resultRow: {
    alignItems: "center",
    borderTopColor: "#CCCCCC",
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 54,
    paddingVertical: 12,
  },
  lastResultRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CCCCCC",
  },
  resultLabel: {
    color: colors.muted,
    flex: 1,
    fontSize: 14,
  },
  resultValue: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },
});
