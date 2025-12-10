import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, type Theme } from "../../../shared/theme";
import type { SurveyAnswerOption } from "../types";

interface AnswerOptionProps {
  option: SurveyAnswerOption;
  isSelected: boolean;
  onSelect: (id: string, value: string | number) => void;
}

export default function AnswerOption({
  option,
  isSelected,
  onSelect,
}: AnswerOptionProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={() => onSelect(option.id, option.value)}
      activeOpacity={0.7}
    >
      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && (
          <Ionicons
            name="checkmark"
            size={theme.fontSizes.sm}
            color={theme.colors.background}
          />
        )}
      </View>
      <Text style={styles.label}>{option.label}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: "transparent",
    },
    containerSelected: {
      borderColor: theme.colors.primary,
    },
    radio: {
      width: theme.spacing.lg,
      height: theme.spacing.lg,
      borderRadius: theme.borderRadius.full,
      borderWidth: 2,
      borderColor: theme.colors.outline,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    radioSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    label: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      flex: 1,
    },
  });
