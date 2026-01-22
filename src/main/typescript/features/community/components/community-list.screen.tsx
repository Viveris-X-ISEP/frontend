import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import { useCommunityUsers } from "../hooks/useCommunityUsers";
import { UserCard } from "./user-card.component";
import { UserSearchBar } from "./user-search-bar.component";

export default function CommunityListScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const {
    filteredUsers,
    searchQuery,
    setSearchQuery,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore
  } = useCommunityUsers();

  const handleUserPress = (userId: string) => {
    router.push(`/community/${userId}` as never);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Communauté</Text>
      <UserSearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserCard user={item} onPress={() => handleUserPress(item.id)} />}
        onEndReached={hasMore && !searchQuery ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.loadingMore}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
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
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    errorText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.error,
      textAlign: "center"
    },
    emptyText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginTop: theme.spacing.xl
    },
    loadingMore: {
      marginVertical: theme.spacing.lg
    }
  });
