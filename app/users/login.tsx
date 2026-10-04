import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { Link, router } from "expo-router";
import { AuthLayout } from "../../components/AuthLayout";
import { FormField } from "../../components/FormField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { login, getErrorMessage } from "../../lib/api";
import { saveToken } from "../../lib/session";
import { colors } from "../../lib/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email address and password.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.success || !result.token) {
        Alert.alert("Login error", result.msg ?? "The server did not return a login token.");
        return;
      }
      await saveToken(result.token);
      router.replace("/motors/validation");
    } catch (error) {
      Alert.alert("Login error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Login to your account in ST Ford Alternator!"
    >
      <FormField
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="example@gmail.com"
        value={email}
      />
      <FormField
        autoComplete="password"
        label="Password"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        value={password}
      />
      <PrimaryButton label="LOGIN" loading={loading} onPress={submit} />
      <Text style={styles.footer}>
        New to ST Ford Alternator app?{" "}
        <Link href="/users/register" style={styles.link}>
          Create Account
        </Link>
      </Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    color: colors.white,
    fontSize: 14,
    marginTop: 22,
    textAlign: "center",
  },
  link: {
    color: colors.white,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
