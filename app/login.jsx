import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setErrorMsg("Email and password are required");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    }
    setIsLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to continue where you left off
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={"#888"}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={"#888"}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <TouchableOpacity
        style={styles.btn}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={"#fff"} />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>
      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.replace("/signup")}>
          <Text style={styles.link}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "poppins-bold",
    fontSize: 28,
    color: "#282828",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "poppins-regular",
    color: "rgba(40, 40, 40, 0.5)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2a2a2a",
    color: "#282828",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontFamily: "poppins-regular",
  },
  btn: {
    width: 180,
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  btnText: {
    color: "#fff",
    fontFamily: "poppins-regular",
    fontSize: 16,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  switchText: {
    color: "#282828",
    fontFamily: "poppins-regular",
  },
  link: {
    color: "#4f46e5",
    fontFamily: "poppins-regular",
  },
  error: {
    color: "#ff6b6b",
    marginBottom: 8,
    textAlign: "center",
  },
});
