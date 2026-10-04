import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { Link, router } from "expo-router";
import { AuthLayout } from "../../components/AuthLayout";
import { FormField } from "../../components/FormField";
import { PrimaryButton } from "../../components/PrimaryButton";
import { getErrorMessage, registerAccount } from "../../lib/api";
import { saveToken } from "../../lib/session";
import { colors, fonts } from "../../lib/theme";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !email.trim() || !phoneNo.trim() || !password) {
      Alert.alert("Missing details", "Complete each field before creating your account.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerAccount({
        name: name.trim(),
        email: email.trim(),
        phoneNo: phoneNo.trim(),
        password,
      });
      if (!result.success || !result.token) {
        Alert.alert(
          "Registration error",
          result.msg ?? "The server did not return a login token.",
        );
        return;
      }
      await saveToken(result.token);
      router.replace("/motors/validation");
    } catch (error) {
      Alert.alert("Registration error", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Get started"
      subtitle="Create your account to verify your ST Ford alternator."
    >
      <FormField
        autoComplete="name"
        label="Name"
        onChangeText={setName}
        placeholder="Enter name"
        value={name}
      />
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
        autoComplete="tel"
        keyboardType="phone-pad"
        label="Mobile Number"
        maxLength={11}
        onChangeText={setPhoneNo}
        placeholder="Phone number"
        value={phoneNo}
      />
      <FormField
        autoComplete="new-password"
        label="Password"
        onChangeText={setPassword}
        placeholder="Create your password"
        secureTextEntry
        value={password}
      />
      <PrimaryButton label="Create account" loading={loading} onPress={submit} />
      <Text style={styles.footer}>
        Have an account?{" "}
        <Link href="/users/login" style={styles.link}>
          Login
        </Link>
      </Text>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: 14,
    marginTop: 24,
    textAlign: "center",
  },
  link: {
    color: colors.brand,
    fontFamily: fonts.bold,
  },
});
