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

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup() {
    const cleanedName = String(name).trim();
    const cleanedEmail = String(email).trim();
    const cleanedPassword = String(password).trim();

    if (!cleanedName || !cleanedEmail || !cleanedPassword) {
      setErrorMsg("Name, email and password are required");
      return;
    }

    const namePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!namePattern.test(cleanedName)) {
      setErrorMsg("Name must be 3-20 chars, letters/numbers/underscores only");
      return;
    }

    const emailPattern = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]{2,}$/i;
    if (!emailPattern.test(cleanedEmail)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setMsg("");
    const { error } = await supabase.auth.signUp({
      email: cleanedEmail,
      password: cleanedPassword,
      options: {
        data: { displayName: cleanedName },
      },
    });

    if (error) {
      const msg = String(error?.message || "").toLowerCase();
      if (
        msg.includes("already registered") ||
        msg.includes("already exists")
      ) {
        setErrorMsg(
          "An account with this email already exists, try logging in."
        );
      } else if (error?.status === 422) {
        setErrorMsg("Unable to sign up with this email. Please try another.");
      } else if (error?.status === 400 && msg.includes("password")) {
        setErrorMsg("Password does not meet requirements.");
      } else {
        setErrorMsg(error.message);
      }
    } else {
      setMsg("Signup successful. Redirecting to login...");
      await supabase.auth.signOut();
      // Safe navigation after a short delay
      setTimeout(() => {
        router.replace("/login");
      }, 1000);
    }
    setIsLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join us and start organizing today</Text>
      {msg ? (
        <Text style={styles.info}>{msg}</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            inputMode="text"
            placeholder="Name"
            placeholderTextColor={"#888"}
            autoCapitalize="none"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            inputMode="email"
            placeholder="Email"
            placeholderTextColor={"#888"}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={"#888"}
            value={password}
            onChangeText={setPassword}
          />
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create account</Text>
            )}
          </TouchableOpacity>
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.link}> Log in</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    borderColor: "#2a2a2e",
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
  info: {
    color: "#282828",
    marginBottom: 8,
    textAlign: "center",
  },
});
