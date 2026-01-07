import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import { useSubmitSurvey, useSurvey } from "../hooks";
import AnswerOption from "./answer-option.component";

export default function SurveyQuestionsScreen() {
  // TODO: Display error message if survey fails to send
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentAnswer,
    answers,
    isFirstQuestion,
    isLastQuestion,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion
  } = useSurvey();

  const { submitSurvey, isSubmitting, error } = useSubmitSurvey();

  const handleClose = () => {
    router.back();
  };

  const handleNext = () => {
    if (isLastQuestion) {
      submitSurvey(answers);
    } else {
      goToNextQuestion();
    }
  };

  const handlePrevious = () => {
    goToPreviousQuestion();
  };

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const canProceed = currentAnswer !== undefined;

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons name="close" size={theme.fontSizes.xxl} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} sur {totalQuestions}
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
        </View>
      </View>

      {/* Question Content */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{currentQuestion?.text}</Text>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion?.options?.map((option) => (
            <AnswerOption
              key={option.id}
              option={option}
              isSelected={currentAnswer?.answerId === option.id}
              onSelect={selectAnswer}
            />
          ))}
        </View>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handlePrevious}
          disabled={isFirstQuestion}
        >
          <Text style={[styles.secondaryButtonText, isFirstQuestion && styles.disabledText]}>
            Retour
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            (!canProceed || isSubmitting) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!canProceed || isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.background} />
              <Text style={[styles.primaryButtonText, styles.loadingText]}>Calcul en cours...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>{isLastQuestion ? "Terminer" : "Suivant"}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg
    },
    closeButton: {
      alignSelf: "flex-end",
      padding: theme.spacing.sm
    },
    progressSection: {
      marginBottom: theme.spacing.lg
    },
    progressText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },
    progressBarContainer: {
      marginTop: theme.spacing.xs
    },
    progressBarBackground: {
      height: theme.spacing.sm,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.full,
      overflow: "hidden"
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full
    },
    contentContainer: {
      flex: 1
    },
    content: {
      paddingBottom: theme.spacing.lg
    },
    questionText: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      lineHeight: theme.fontSizes.xl * 1.3
    },
    optionsContainer: {
      marginTop: theme.spacing.md
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.fontSizes.sm,
      textAlign: "center",
      marginTop: theme.spacing.md
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: theme.spacing.md
    },
    button: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.full,
      minWidth: 120,
      alignItems: "center"
    },
    primaryButton: {
      backgroundColor: theme.colors.primary
    },
    primaryButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.md,
      fontWeight: "600"
    },
    secondaryButton: {
      backgroundColor: theme.colors.inputBackground
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.md,
      fontWeight: "600"
    },
    disabledButton: {
      opacity: 0.5
    },
    disabledText: {
      opacity: 0.5
    },
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm
    },
    loadingText: {
      marginLeft: theme.spacing.sm
    }
  });
