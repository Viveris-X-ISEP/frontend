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
        <Text style={styles.sectionTitle}>Empreinte Carbone Totale</Text>
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
        <Text style={styles.sectionTitle}>Empreinte Carbone Totale</Text>
        <Text style={styles.totalValue}>{totalTons.toFixed(1)} tonnes</Text>
      </View>

      {/* Emissions Breakdown Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.sectionTitle}>Répartition des Émissions</Text>
        <Text style={styles.breakdownTotal}>100%</Text>
        <Text style={styles.breakdownLabel}>Actuel</Text>

        {/* Horizontal Bars */}
        <View style={styles.barsContainer}>
          {breakdown.map((item) => (
            <View key={item.label} style={styles.barRow}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
                <View style={styles.barMarker} />
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
      backgroundColor: "#2D2D2D",
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg
    },
    topSection: {
      marginBottom: theme.spacing.xl
    },
    bottomSection: {
      paddingTop: theme.spacing.md
    },
    sectionTitle: {
      fontSize: theme.fontSizes.md,
      color: "#9CA3AF",
      marginBottom: theme.spacing.sm
    },
    totalValue: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: theme.spacing.xs
    },
    percentage: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "600",
      color: "#4ADE80",
      marginBottom: theme.spacing.xs
    },
    percentageNegative: {
      color: "#4ADE80"
    },
    periodLabel: {
      fontSize: theme.fontSizes.sm,
      color: "#6B7280",
      marginBottom: theme.spacing.lg
    },
    chartContainer: {
      marginTop: theme.spacing.md
    },
    chartPlaceholder: {
      height: 100,
      backgroundColor: "#3D3D3D",
      borderRadius: theme.borderRadius.sm,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.sm
    },
    chartPlaceholderText: {
      fontSize: theme.fontSizes.lg,
      color: "#4ADE80"
    },
    chartLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.sm
    },
    chartLabel: {
      fontSize: theme.fontSizes.sm,
      color: "#4ADE80"
    },
    breakdownTotal: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#FFFFFF",
      marginBottom: theme.spacing.xs
    },
    breakdownLabel: {
      fontSize: theme.fontSizes.sm,
      color: "#4ADE80",
      marginBottom: theme.spacing.lg
    },
    barsContainer: {
      gap: theme.spacing.lg
    },
    barRow: {
      marginBottom: theme.spacing.md
    },
    barLabel: {
      fontSize: theme.fontSizes.sm,
      color: "#4ADE80",
      marginBottom: theme.spacing.xs
    },
    barTrack: {
      height: 8,
      backgroundColor: "#3D3D3D",
      borderRadius: theme.borderRadius.sm,
      position: "relative",
      overflow: "visible"
    },
    barFill: {
      height: "100%",
      backgroundColor: "#4ADE80",
      borderRadius: theme.borderRadius.sm
    },
    barMarker: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: "#FFFFFF"
    },
    noData: {
      fontSize: theme.fontSizes.md,
      color: "#9CA3AF",
      textAlign: "center",
      marginTop: theme.spacing.md
    }
  });
