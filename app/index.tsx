import { Link } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors } from "../lib/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          accessibilityLabel="ST Ford"
          resizeMode="contain"
          source={require("../assets/images/full-logo.png")}
          style={styles.logo}
        />
        <Image
          accessibilityLabel="Red alternator"
          resizeMode="contain"
          source={require("../assets/images/alternator.png")}
          style={styles.alternator}
        />
        <View style={styles.copy}>
          <Text style={styles.title}>ST Ford Alternator App</Text>
          <Text style={styles.subtitle}>
            Check the details and status of your ST Ford alternator by serial number.
          </Text>
        </View>
        <View style={styles.actions}>
          <Link href="/users/register" asChild>
            <PrimaryButton label="CREATE ACCOUNT" onPress={() => {}} />
          </Link>
          <Link href="/users/login" asChild>
            <PrimaryButton label="LOGIN" onPress={() => {}} variant="brand" />
          </Link>
          <Link href="/motors/validation" style={styles.validateLink}>
            <Text style={styles.validateText}>Validate an alternator</Text>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.brand,
    flex: 1,
  },
  content: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 28,
  },
  logo: {
    height: 68,
    marginBottom: 8,
    width: 220,
  },
  alternator: {
    height: 225,
    marginVertical: 10,
    width: 225,
  },
  copy: {
    alignItems: "center",
    marginBottom: 26,
  },
  title: {
    color: colors.white,
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 9,
    opacity: 0.94,
    textAlign: "center",
  },
  actions: {
    gap: 12,
    width: "100%",
  },
  validateLink: {
    alignSelf: "center",
    padding: 10,
  },
  validateText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
