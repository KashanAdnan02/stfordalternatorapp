import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../lib/theme";

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
  variant = "light",
}: PrimaryButtonProps) {
  const light = variant === "light";
  return (
    <Pressable
      accessibilityRole="button"
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
    borderRadius: 6,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: 20,
    width: "100%",
  },
  lightButton: {
    backgroundColor: colors.white,
  },
  brandButton: {
    backgroundColor: colors.brand,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  lightLabel: {
    color: colors.brand,
  },
  brandLabel: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.75,
  },
});
