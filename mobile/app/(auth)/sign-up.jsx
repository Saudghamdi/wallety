import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, I18nManager } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { styles } from "@/assets/styles/auth.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// تمكين RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setPendingVerification(true);
      setError("");
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("البريد الإلكتروني مستخدم بالفعل.");
      } else if (err.errors?.[0]?.code === "form_password_pwned") {
        setError("كلمة المرور ضعيفة جداً.");
      } else if (err.errors?.[0]?.code === "form_param_format_invalid") {
        setError("البريد الإلكتروني غير صحيح.");
      } else {
        setError("حدث خطأ، حاول مرة أخرى.");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("رمز التحقق غير صحيح.");
      } else {
        setError("حدث خطأ، حاول مرة أخرى.");
      }
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={30}
      >
        <View style={styles.container}>
          <Image 
            source={require("../../assets/images/Capture4.png")} 
            style={{
              width: 500,
              height: 400,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          <Text style={styles.title}>تحقق من بريدك</Text>
          <Text style={[styles.footerText, { textAlign: "center", marginBottom: 20 }]}>
            أدخل رمز التحقق المرسل إلى {emailAddress}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            style={[styles.input, { textAlign: "center", fontSize: 24, letterSpacing: 8 }]}
            value={code}
            placeholder="000000"
            placeholderTextColor="#9eaba5ff"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={setCode}
          />

          <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
            <Text style={styles.buttonText}>تحقق</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setPendingVerification(false)}
            style={{ marginTop: 16 }}
          >
            <Text style={styles.linkText}>رجوع</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image 
          source={require("../../assets/images/Capture4.png")} 
          style={{
            width: 400,
            height: 400,
            alignSelf: "center",
            marginBottom: 20,
          }}
        />

        <Text style={styles.title}>إنشاء حساب جديد</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput, { textAlign: "right" }]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#9eaba5ff"
          placeholder="أدخل بريدك الإلكتروني"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput, { textAlign: "right" }]}
          value={password}
          placeholder="أدخل كلمة المرور "
          placeholderTextColor="#9eaba5ff"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>إنشاء حساب</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <Text style={styles.footerText}>لديك حساب بالفعل؟</Text>
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={[styles.linkText, { marginRight: 6 }]}>تسجيل دخول</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}