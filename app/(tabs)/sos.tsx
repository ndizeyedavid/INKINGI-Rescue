import EmergencyCard from "@/components/EmergencyCard";
import PageHeader from "@/components/pageHeader";
import { useAuth } from "@/context/AuthContext";
import { emergencyApi } from "@/services/api/api.service";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Emergency {
  id: string;
  type: string;
  description: string;
  address: string;
  status: "reported" | "dispatched" | "resolved";
  latitude: number;
  longitude: number;
  createdAt: string;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  volunteers?: any[];
}

type DateFilter = "all" | "today" | "yesterday" | "7days" | "30days" | "90days";

export default function SosPage() {
  const [activeTab, setActiveTab] = useState<"you" | "others">("you");
  const [dateFilter, setDateFilter] = useState<DateFilter>("today");
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();

  const [myEmergencies, setMyEmergencies] = useState<Emergency[]>([]);
  const [otherEmergencies, setOtherEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      setError(null);
      const response = await emergencyApi.getAll();

      if (response.success && response.data) {
        const emergencies = Array.isArray(response.data) ? response.data : [];

        // Separate emergencies into "mine" and "others"
        const mine = emergencies.filter(
          (e: Emergency) => e.user?.id === user?.id
        );
        const others = emergencies.filter(
          (e: Emergency) => e.user?.id !== user?.id
        );

        setMyEmergencies(mine);
        setOtherEmergencies(others);
      } else {
        setError(response.error || "Failed to fetch emergencies");
      }
    } catch (err: any) {
      console.error("Error fetching emergencies:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEmergencies();
  };

  const handleDeleteEmergency = async (id: string) => {
    try {
      const response = await emergencyApi.delete(id);
      if (response.success) {
        // Remove from local state
        setMyEmergencies((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error("Error deleting emergency:", err);
    }
  };

  const getEmergencyIcon = (type: string): string => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("medical")) return "hand-holding-heart";
    if (lowerType.includes("fire")) return "fire";
    if (lowerType.includes("accident")) return "car-burst";
    if (lowerType.includes("flood")) return "house-flood-water";
    if (lowerType.includes("quake")) return "house-crack";
    if (lowerType.includes("robbery")) return "people-robbery";
    if (lowerType.includes("assault")) return "user-injured";
    return "ellipsis";
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getUserName = (emergency: Emergency): string => {
    if (emergency.user?.firstName && emergency.user?.lastName) {
      return `${emergency.user.firstName} ${emergency.user.lastName}`;
    }
    return emergency.user?.name || "Anonymous";
  };

  // Get date range based on filter
  const getDateRange = (filter: DateFilter): { start: Date; end: Date } => {
    const now = new Date();
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );
    let start: Date;

    switch (filter) {
      case "today":
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0
        );
        break;
      case "yesterday":
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          0,
          0,
          0,
          0
        );
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "7days":
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7,
          0,
          0,
          0,
          0
        );
        break;
      case "30days":
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 30,
          0,
          0,
          0,
          0
        );
        break;
      case "90days":
        start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 90,
          0,
          0,
          0,
          0
        );
        break;
      default:
        // "all" - return a very old date to include everything
        start = new Date(0);
        break;
    }

    return { start, end };
  };

  // Filter emergencies based on date filter
  const filterEmergenciesByDate = (emergencies: Emergency[]): Emergency[] => {
    if (dateFilter === "all") {
      return emergencies;
    }

    const { start, end } = getDateRange(dateFilter);

    return emergencies.filter((emergency) => {
      const emergencyDate = new Date(emergency.createdAt);
      return emergencyDate >= start && emergencyDate <= end;
    });
  };

  // Get filtered emergencies
  const filteredMyEmergencies = useMemo(() => {
    return filterEmergenciesByDate(myEmergencies);
  }, [myEmergencies, dateFilter]);

  const filteredOtherEmergencies = useMemo(() => {
    return filterEmergenciesByDate(otherEmergencies);
  }, [otherEmergencies, dateFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title={t("sos.title")} />

      {/* Pills Navigation */}
      <View style={styles.pillsContainer}>
        <TouchableOpacity
          style={[styles.pill, activeTab === "you" && styles.activePill]}
          onPress={() => setActiveTab("you")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pillText,
              activeTab === "you" && styles.activePillText,
            ]}
          >
            {t("sos.you")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, activeTab === "others" && styles.activePill]}
          onPress={() => setActiveTab("others")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.pillText,
              activeTab === "others" && styles.activePillText,
            ]}
          >
            {t("sos.others")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateFilterContainer}
        contentContainerStyle={styles.dateFilterContent}
      >
        {[
          { key: "all", label: t("dateFilters.all") },
          { key: "today", label: t("dateFilters.today") },
          { key: "yesterday", label: t("dateFilters.yesterday") },
          { key: "7days", label: t("dateFilters.7days") },
          { key: "30days", label: t("dateFilters.30days") },
          { key: "90days", label: t("dateFilters.90days") },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.dateFilterPill,
              dateFilter === filter.key && styles.activeDateFilterPill,
            ]}
            onPress={() => setDateFilter(filter.key as DateFilter)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dateFilterText,
                dateFilter === filter.key && styles.activeDateFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Area */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#e6491e"]} // Android
            tintColor="#e6491e" // iOS
          />
        }
      >
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#e6491e" />
            <Text style={styles.emptyText}>Loading emergencies...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity
              onPress={fetchEmergencies}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: "#e6491e", fontWeight: "600" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : activeTab === "you" ? (
          filteredMyEmergencies.length > 0 ? (
            filteredMyEmergencies.map((emergency) => (
              <TouchableOpacity
                key={emergency.id}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/view-sos",
                    params: {
                      emergencyId: emergency.id,
                      emergencyType: emergency.type,
                    },
                  })
                }
              >
                <EmergencyCard
                  location={
                    emergency.address ||
                    emergency.latitude + ", " + emergency.longitude
                  }
                  icon={getEmergencyIcon(emergency.type)}
                  type={emergency.type}
                  description={emergency.description}
                  isMine={true}
                  onDelete={() => handleDeleteEmergency(emergency.id)}
                  status={emergency.status}
                  timeReported={formatTimeAgo(emergency.createdAt)}
                  volunteersCount={emergency.volunteers?.length || 0}
                />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {dateFilter === "all"
                  ? t("dateFilters.noEmergenciesYou")
                  : t("dateFilters.noEmergenciesPeriod")}
              </Text>
            </View>
          )
        ) : filteredOtherEmergencies.length > 0 ? (
          filteredOtherEmergencies.map((emergency) => (
            <TouchableOpacity
              key={emergency.id}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/view-sos",
                  params: {
                    emergencyId: emergency.id,
                    emergencyType: emergency.type,
                  },
                })
              }
            >
              <EmergencyCard
                location={
                  emergency.address ||
                  emergency.latitude + ", " + emergency.longitude
                }
                icon={getEmergencyIcon(emergency.type)}
                type={emergency.type}
                description={emergency.description}
                reportedBy={getUserName(emergency)}
                status={emergency.status}
                timeReported={formatTimeAgo(emergency.createdAt)}
                volunteersCount={emergency.volunteers?.length || 0}
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {dateFilter === "all"
                ? t("dateFilters.noEmergenciesOthers")
                : t("dateFilters.noEmergenciesPeriod")}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  pillsContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666666",
  },
  activePillText: {
    color: "#e6491e",
    fontWeight: "600",
  },
  dateFilterContainer: {
    marginHorizontal: 10,
    marginBottom: 16,
    maxHeight: 35,
  },
  dateFilterContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  dateFilterPill: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeDateFilterPill: {
    backgroundColor: "#e6491e",
    borderColor: "#e6491e",
  },
  dateFilterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666666",
  },
  activeDateFilterText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 60,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
    textAlign: "center",
  },
});
