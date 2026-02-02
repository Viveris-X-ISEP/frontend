import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import { getRewardImage } from "../constants/reward-images";
import type { UserRewardDto } from "../types";

interface Props {
  item: UserRewardDto;
}

export default function RewardCard({ item }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const title = item.reward?.title || `Récompense #${item.rewardId}`;
  const description = item.reward?.description || "";
  const points = item.reward?.pointsCost ?? 0;
  const imgSource = getRewardImage(item.reward?.title, item.rewardId);

  return (
    <View style={styles.card}>
      <Image source={imgSource} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Text style={styles.points}>{points} pts</Text>
          <Text style={styles.qty}>x{item.quantity}</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      width: 180,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
      overflow: "hidden",
      marginRight: theme.spacing.md
    },
    image: {
      width: "100%",
      height: 100
    },
    content: {
      padding: theme.spacing.sm
    },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: "600",
      color: theme.colors.text
    },
    description: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text,
      opacity: 0.8,
      marginTop: theme.spacing.xs
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: theme.spacing.sm
    },
    points: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text
    },
    qty: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      fontWeight: "600"
    }
  });
