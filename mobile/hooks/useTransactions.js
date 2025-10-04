// ملف React Hook مخصص لإدارة العمليات المالية

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

// const API_URL = "https://wallet-api-cxqp.onrender.com/api";
// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,   // الرصيد الكلّي
    income: 0,    // الدخل
    expenses: 0,  // المصروفات
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback لتحسين الأداء وحفظ الدالة في الذاكرة
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("خطأ في جلب العمليات:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("خطأ في جلب ملخص الرصيد:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // يمكن تنفيذهما بشكل متوازي
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("فشل في حذف العملية");

      // تحديث البيانات بعد الحذف
      loadData();
      Alert.alert("تم", "تم حذف العملية بنجاح");
    } catch (error) {
      console.error("خطأ في حذف العملية:", error);
      Alert.alert("خطأ", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
