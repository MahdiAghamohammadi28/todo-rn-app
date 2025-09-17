import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const user = data?.user;
      const em = user?.email ?? "";
      const nm = user?.user_metadata?.displayName ?? "";
      setEmail(em);
      setName(nm);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      Alert.alert("Logout failed", e?.message || "Please try again");
    }
  }, []);

  const initials = (email || "").trim().charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials || "U"}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name || "Unknown"}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {email || "Unknown"}
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: "poppins-black",
    fontSize: 42,
    color: "#1e3a8a",
  },
  name: {
    fontFamily: "poppins-bold",
    color: "#282828",
    fontSize: 16,
    textAlign: "center",
  },
  email: {
    fontFamily: "poppins-regular",
    color: "rgba(40, 40, 40, 0.6)",
    fontSize: 14,
  },
  logoutBtn: {
    width: 100,
    marginTop: 24,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontFamily: "poppins-bold",
    fontSize: 16,
  },
});
