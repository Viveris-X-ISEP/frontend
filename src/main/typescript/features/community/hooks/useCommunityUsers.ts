import { useCallback, useEffect, useState } from "react";
import { CommunityService } from "../services/community.service";
import type { CommunityUser } from "../types";

interface UseCommunityUsersReturn {
  users: CommunityUser[];
  filteredUsers: CommunityUser[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

const PAGE_SIZE = 12;

export function useCommunityUsers(): UseCommunityUsersReturn {
  const [users, setUsers] = useState<CommunityUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchUsers = useCallback(async (pageNum: number, isInitial: boolean) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const response = await CommunityService.getCommunityUsers(pageNum, PAGE_SIZE);

      if (isInitial) {
        setUsers(response.data);
      } else {
        setUsers((prev) => [...prev, ...response.data]);
      }

      setHasMore(pageNum < response.totalPages - 1);
      setPage(pageNum);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
    } finally {
      if (isInitial) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers(0, true);
  }, [fetchUsers]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchUsers(page + 1, false);
    }
  }, [loadingMore, hasMore, page, fetchUsers]);

  const refetch = useCallback(() => {
    setUsers([]);
    setPage(0);
    setHasMore(true);
    fetchUsers(0, true);
  }, [fetchUsers]);

  const filteredUsers = searchQuery
    ? users.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  return {
    users,
    filteredUsers,
    searchQuery,
    setSearchQuery,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch
  };
}
