import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";
import { TransactionItem } from "../../components/TransactionItem";
import NoTransactionsFound from "../../components/NoTransactionsFound";
import { useIsFocused } from "@react-navigation/native";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id
  );

  const getDisplayName = () => {
    return (
      user?.unsafeMetadata?.displayName || 
      user?.firstName || 
      user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
      "المستخدم"
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.reload) {
      await user.reload();
    }
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isFocused && user?.reload) {
      user.reload();
    }
  }, [isFocused, user]);

  const handleDelete = (id) => {
    Alert.alert(
      "حذف العملية",
      "هل أنت متأكد أنك تريد حذف هذه العملية؟",
      [
        { text: "إلغاء", style: "cancel" },
        { text: "حذف", style: "destructive", onPress: () => deleteTransaction(id) },
      ]
    );
  };

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* الهيدر */}
        <View style={styles.header}>
          {/* اللوجو في أقصى اليسار */}
          <Image
            source={require("../../assets/images/Capture4.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />

          {/* النص في الوسط */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>مرحباً،</Text>
            <Text style={styles.usernameText}>
              {getDisplayName()}
            </Text>
          </View>

          {/* الأزرار في اليمين */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addButtonText}>إضافة</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        {/* بطاقة الرصيد */}
        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>العمليات الأخيرة</Text>
        </View>
      </View>

      {/* قائمة العمليات */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} onDelete={handleDelete} />}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}