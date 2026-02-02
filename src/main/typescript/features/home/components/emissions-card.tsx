import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import type { UserEmissionDto } from "../../survey/types";

interface EmissionsCardProps {
  emissions: UserEmissionDto | null;
  historicalData?: UserEmissionDto[];
}

export const EmissionsCard = ({ emissions, historicalData }: EmissionsCardProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [percentageChange, setPercentageChange] = useState<number>(0);

  useEffect(() => {
    // Calculate percentage change from historical data if available
    if (historicalData && historicalData.length >= 2) {
      const current = historicalData[historicalData.length - 1].totalEmissions;
      const previous = historicalData[historicalData.length - 2].totalEmissions;
      const change = ((current - previous) / previous) * 100;
      setPercentageChange(change);
    }
  }, [historicalData]);

  if (!emissions) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Empreinte Carbone Annuelle</Text>
        <Text style={styles.noData}>Aucune donnée disponible</Text>
      </View>
    );
  }

  // Convert kg to tons
  const totalTons = emissions.totalEmissions / 1000;

  // Calculate percentages for breakdown
  const total = emissions.totalEmissions;
  const breakdown = [
    {
      label: "Transport",
      value: emissions.transportEmissions,
      percentage: (emissions.transportEmissions / total) * 100
    },
    {
      label: "Alimentation",
      value: emissions.foodEmissions,
      percentage: (emissions.foodEmissions / total) * 100
    },
    {
      label: "Logement",
      value: emissions.housingEmissions,
      percentage: (emissions.housingEmissions / total) * 100
    },
    {
      label: "Numérique",
      value: emissions.digitalEmissions,
      percentage: (emissions.digitalEmissions / total) * 100
    }
  ];

  return (
    <View style={styles.container}>
      {/* Total CO2 Section */}
      <View style={styles.topSection}>
        <Text style={styles.sectionTitle}>Empreinte Carbone Annuelle</Text>
        <Text style={styles.totalValue}>{totalTons.toFixed(1)} tonnes</Text>
      </View>

      {/* Emissions Breakdown Section */}
      <View style={styles.bottomSection}>
        {/* Horizontal Bars */}
        <View style={styles.barsContainer}>
          {breakdown.map((item) => (
            <View key={item.label} style={styles.barRow}>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barLabel}>{item.label}</Text>
                <Text style={styles.barPercentage}>
                  {(item.value / 1000).toFixed(2)}t ({item.percentage.toFixed(1)}%)
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg
    },
    topSection: {
      marginBottom: theme.spacing.md
    },
    bottomSection: {
      paddingTop: theme.spacing.xs
    },
    sectionTitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary
    },
    totalValue: {
      fontSize: theme.fontSizes.xxl + 8,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.xs
    },
    percentage: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "600",
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs
    },
    percentageNegative: {
      color: theme.colors.primary
    },
    periodLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.outline,
      marginBottom: theme.spacing.lg
    },
    chartContainer: {
      marginTop: theme.spacing.md
    },
    chartPlaceholder: {
      height: 100,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.sm
    },
    chartPlaceholderText: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.primary
    },
    chartLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm
    },
    chartLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary
    },
    barsContainer: {
      gap: theme.spacing.lg
    },
    barRow: {
      marginBottom: theme.spacing.md
    },
    barLabelContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.xs
    },
    barLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary
    },
    barPercentage: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      fontWeight: "600"
    },
    barTrack: {
      height: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      position: "relative",
      overflow: "visible"
    },
    barFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.sm
    },
    barMarker: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: theme.colors.text
    },
    noData: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.outline,
      textAlign: "center",
      marginTop: theme.spacing.md
    }
  });
