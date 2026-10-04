import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors, fonts } from "../lib/theme";

type FormFieldProps = TextInputProps & {
  label: string;
};

export function FormField({ label, style, ...inputProps }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        selectionColor={colors.brand}
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 14,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.semibold,
    fontSize: 13,
    marginBottom: 7,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
});
