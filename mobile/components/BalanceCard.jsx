import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const BalanceCard = ({ summary }) => {
  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>الرصيد الكلّي</Text>

      {/* الرصيد */}
      <Text style={[styles.balanceAmount, { textAlign: "left" }]}>
        {parseFloat(summary.balance).toFixed(2)} ريال
      </Text>

      {/* إحصائيات */}
      <View style={styles.balanceStats}>
        {/* الدخل */}
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>الدخل</Text>
          <Text
            style={[
              styles.balanceStatAmount,
              { color: COLORS.income, textAlign: "left" },
            ]}
          >
            +{parseFloat(summary.income).toFixed(2)} ريال
          </Text>
        </View>

        <View style={[styles.balanceStatItem, styles.statDivider]} />

        {/* الصرف */}
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>الصرف</Text>
          <Text
            style={[
              styles.balanceStatAmount,
              { color: COLORS.expense, textAlign: "left" },
            ]}
          >
            -{Math.abs(parseFloat(summary.expenses)).toFixed(2)} ريال
          </Text>
        </View>
      </View>
    </View>
  );
};
