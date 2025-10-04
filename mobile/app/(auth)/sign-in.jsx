import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styles } from "../../assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("كلمة السر خطأ.");
      } else {
        setError("حدث خطأ.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      
     <View style={styles.container}>
             {/* الشعار أكبر وفي المنتصف */}
             <Image 
               source={require("../../assets/images/Capture4.png")} 
               style={{
                 width: 400,       // عرض أكبر
                 height: 400,      // ارتفاع أكبر
                 alignSelf: "center", // تمركز في المنتصف
                 marginBottom: 20,    // مسافة بين الشعار والنص
               }}
             />
        <Text style={styles.title}>اهلا وسهلا</Text>

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
          placeholder="الإيميل"
          placeholderTextColor="#9eaba5ff"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput, { textAlign: "right" }]}
          value={password}
          placeholder="كلمة السر"
          placeholderTextColor="#9eaba5ff"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>تسجيل دخول</Text>
        </TouchableOpacity>

        {/* الفوتر */}
       
  <View
  style={{
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <Text style={styles.footerText}>لا يوجد لديك حساب؟</Text>

  <Link href="/sign-up" asChild>
    <TouchableOpacity>
      <Text style={[styles.linkText, { marginRight: 6 }]}>تسجيل</Text>
    </TouchableOpacity>
  </Link>
</View>


      </View>
    </KeyboardAwareScrollView>
  );
}
