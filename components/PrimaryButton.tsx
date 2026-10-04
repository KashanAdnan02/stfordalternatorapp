import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts } from "../lib/theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "light" | "brand";
};

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  variant = "brand",
}: PrimaryButtonProps) {
  const light = variant === "light";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: loading, busy: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        light ? styles.lightButton : styles.brandButton,
        pressed && !loading && styles.pressed,
        loading && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={light ? colors.brand : colors.white} />
      ) : (
        <Text style={[styles.label, light ? styles.lightLabel : styles.brandLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 13,
    justifyContent: "center",
    marginTop: 22,
    minHeight: 54,
    paddingHorizontal: 20,
    width: "100%",
  },
  lightButton: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
  },
  brandButton: {
    backgroundColor: colors.brand,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 14,
    letterSpacing: 0.3,
  },
  lightLabel: {
    color: colors.text,
  },
  brandLabel: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.84,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.68,
  },
});
