// constants/colors.js
const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
};

const forestTheme = {
  primary: "#2E7D32",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#66BB6A",
  expense: "#C62828",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const purpleTheme = {
  primary: "#6A1B9A",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#BA68C8",
  expense: "#D32F2F",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const oceanTheme = {
  primary: "#0277BD",
  background: "#E1F5FE",
  text: "#01579B",
  border: "#B3E5FC",
  white: "#FFFFFF",
  textLight: "#4FC3F7",
  expense: "#EF5350",
  income: "#26A69A",
  card: "#FFFFFF",
  shadow: "#000000",
};
const oceanDarkTheme = {
  primary: "#0288D1",      // أزرق داكن
  background: "#0D1B2A",   // خلفية أساسية داكنة جداً
  text: "#E0F7FA",         // نص فاتح على خلفية غامقة
  border: "#1B263B",       // حدود بلون أزرق رمادي غامق
  white: "#121212",        // بديل للـ "أبيض" في وضع الداكن
  textLight: "#81D4FA",    // نص ثانوي أزرق فاتح
  expense: "#E57373",      // أحمر فاتح واضح
  income: "#4DB6AC",       // أخضر مائل للأزرق
  card: "#1E293B",         // لون البطاقات (رمادي مزرق غامق)
  shadow: "#000000",       // ظل غامق
};

const darkTheme = {
  primary: "#2F7A78",       // أزرق فاتح للـ primary
  background: "#121212",    // خلفية رئيسية داكنة جداً
  text: "#ffffffff",          // النصوص بلون رمادي فاتح
  border: "#2C2C2C",        // حدود رمادية داكنة
  white: "#1E1E1E",         // لون ثانوي غامق (بدل الأبيض)
  textLight: "#ffffffff",     // نص ثانوي رمادي
  expense: "#EF5350",       // أحمر للمصروفات
  income: "#66BB6A",        // أخضر للإيرادات
  card: "#1E1E1E",          // لون البطاقات رمادي غامق
  shadow: "#000000",        // ظل أسود
};


export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  dark: darkTheme,
};

// 👇 change this to switch theme
export const COLORS = THEMES.dark;
