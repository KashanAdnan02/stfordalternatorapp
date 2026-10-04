import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors } from "../lib/theme";

type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#A0A3A8"
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 16,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderBottomColor: "rgba(255,255,255,0.65)",
    borderBottomWidth: 1,
    color: colors.white,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
});
