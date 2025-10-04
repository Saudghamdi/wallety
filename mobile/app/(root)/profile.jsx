// app/settings.jsx
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  Image, Alert, ScrollView, ActivityIndicator, Platform 
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function SettingsScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(
    user?.unsafeMetadata?.displayName ||
    user?.firstName ||
    user?.emailAddresses[0]?.emailAddress.split("@")[0] ||
    ""
  );

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  // رفع الصورة
  const uploadImage = async (uri) => {
    setIsUploadingImage(true);
    try {
      let imageFile;

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        imageFile = new File([blob], "profile.jpg", { type: "image/jpeg" });
      } else {
        const fileName = uri.split("/").pop();
        const fileType = fileName.split(".").pop();

        imageFile = {
          uri: uri,
          type: `image/${fileType}`,
          name: fileName,
        };
      }

      await user.setProfileImage({ file: imageFile });
      await user.reload();

      Alert.alert("تم", "تم تحديث الصورة بنجاح");
    } catch (error) {
      console.error("Error updating image:", error);
      Alert.alert("خطأ", "فشل في تحديث الصورة. حاول مرة أخرى.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // اختيار صورة من المعرض
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("عذراً", "نحتاج إلى إذن للوصول إلى الصور");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  // التقاط صورة بالكاميرا
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("عذراً", "نحتاج إلى إذن للوصول إلى الكاميرا");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      uploadImage(result.assets[0].uri);
    }
  };

  // عرض خيارات الصورة
  const handleImageOptions = () => {
    Alert.alert("تغيير الصورة الشخصية", "اختر الطريقة", [
      { text: "التقاط صورة", onPress: takePhoto },
      { text: "معرض الصور", onPress: pickImage },
      { text: "إلغاء", style: "cancel" },
    ]);
  };

  // حفظ الاسم
  const handleSaveName = async () => {
    if (!displayName.trim()) {
      Alert.alert("خطأ", "الرجاء إدخال اسم صحيح");
      return;
    }

    setIsSavingName(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          displayName: displayName.trim(),
        },
      });

      await user.reload();
      Alert.alert("تم", "تم تحديث الاسم بنجاح");

      setTimeout(() => router.back(), 1000);
    } catch (error) {
      console.error("Error updating name:", error);
      Alert.alert("خطأ", "فشل في تحديث الاسم. حاول مرة أخرى.");
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* الهيدر */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <View style={styles.placeholder} />
      </View>

      {/* تغيير الصورة */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الصورة الشخصية</Text>
        <View style={styles.imageSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: user?.imageUrl }}
              style={styles.profileImage}
              defaultSource={require("../../assets/images/logo.png")}
            />
            {isUploadingImage && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#2F7A78" />
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.changeImageButton,
              { backgroundColor: "#2F7A78" }, // أخضر داكن جدا (غامق أكثر من قبل)
              isUploadingImage && styles.buttonDisabled,
            ]}
            onPress={handleImageOptions}
            disabled={isUploadingImage}
          >
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.changeImageText}>
              {isUploadingImage ? "جاري الرفع..." : "تغيير الصورة"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* تغيير الاسم */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الاسم المعروض</Text>
        <View style={styles.nameSection}>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="أدخل اسمك"
              placeholderTextColor="#666"
              editable={!isSavingName}
            />
          </View>

          {/* زر حفظ الاسم - تصميم واتساب */}
          <TouchableOpacity
            style={[
              styles.saveNameButton,
              { backgroundColor: "#2F7A78" }, // أخضر واتساب غامق
              isSavingName && styles.buttonDisabled,
            ]}
            onPress={handleSaveName}
            disabled={isSavingName}
          >
            {isSavingName ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveNameText}>حفظ</Text>
                <Ionicons name="checkmark" size={20} color="#fff" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* البريد الإلكتروني */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>البريد الإلكتروني</Text>
        <View style={styles.emailContainer}>
          <Ionicons name="mail" size={20} color="#888" />
          <Text style={styles.emailText}>{user?.emailAddresses[0]?.emailAddress}</Text>
          <Ionicons name="lock-closed" size={16} color="#666" />
        </View>
        <Text style={styles.helperText}>لا يمكن تغيير البريد الإلكتروني</Text>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" }, // أغمق
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    padding: 15,
  },
  backButton: { padding: 5 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  placeholder: { width: 24 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#222" },
  sectionTitle: { color: "#aaa", fontSize: 16, marginBottom: 10 },
  imageSection: { flexDirection: "row", alignItems: "center" },
  imageWrapper: { position: "relative", marginRight: 15 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  uploadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 25,
  },
  changeImageText: { color: "#fff", marginLeft: 6 },
  nameSection: { marginTop: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, color: "#fff", paddingVertical: 8 },
  saveNameButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
  },
  saveNameText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
  },
  emailText: { color: "#fff", flex: 1 },
  helperText: { color: "#888", fontSize: 12, marginTop: 6 },
  bottomPadding: { height: 50 },
  buttonDisabled: { opacity: 0.6 },
});
 