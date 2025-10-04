import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";
import { useRouter } from "expo-router";

const NoTransactionsFound = () => {
  const router = useRouter();

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>لا توجد معاملات بعد</Text>
      <Text style={styles.emptyStateText}>
       ابدأ بمتابعة مصروفاتك عن طريق إضافة أول معاملة
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
        <Ionicons name="add-circle" size={18} color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}>إضافة معاملة</Text>
      </TouchableOpacity>
    </View>
  );
};
export default NoTransactionsFound;
