import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header({ todos = [], onPressCreate }) {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: top }]}>
      <Text style={styles.title}>My ToDo</Text>
      {todos.length > 0 && (
        <TouchableOpacity style={styles.createBtn} onPress={onPressCreate}>
          <Text style={styles.createBtnText}>Create</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 20,
  },
  title: {
    fontFamily: "poppins-bold",
    fontSize: 24,
  },
  subtitle: {
    fontFamily: "poppins-regular",
    color: "#6b7280",
  },
  createBtn: {
    backgroundColor: "#4f46e5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createBtnText: {
    color: "#fff",
    fontFamily: "poppins-regular",
    textTransform: "capitalize",
  },
});
