import { useUser } from "@clerk/clerk-expo";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

export default function RootLayout() {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href={"/sign-in"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#aaa",
        tabBarStyle: {
          backgroundColor: "#2e2f2f5b",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
      }}
    >
      {/* الرئيسية */}
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* صفحة إنشاء عملية - مخفية من التاب بار */}
      <Tabs.Screen
        name="create"
        options={{
          href: null, // يخفيها من البوتوم بار
        }}
      />

      {/* البروفايل */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "حسابي",
          tabBarIcon: ({ size }) => (
            <Image
              source={{ uri: user?.imageUrl }}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
