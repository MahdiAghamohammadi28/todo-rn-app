import CreateTodoModal from "@/components/CreateTodoModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import FlatListRenderItem from "@/components/FlatListRenderItem";
import Header from "@/components/Header";
import ReminderModal from "@/components/ReminderModal";
import SvgIcons from "@/contants/SvgIcons";
import { supabase } from "@/lib/supabase";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [reminderDate, setReminderDate] = useState(null);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    (async () => {
      const settings = await Notifications.getPermissionsAsync();
      let granted = settings.status === "granted";
      if (!granted) {
        const req = await Notifications.requestPermissionsAsync();
        granted = req.status === "granted";
      }
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: "default",
          vibrationPattern: [250, 250],
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        });
      }
    })();
  }, []);

  const fetchTodos = useCallback(async () => {
    setErrorMessage("");
    try {
      const { data, error } = await supabase.from("todos").select("*");
      if (error) throw error;
      setTodos(data);
    } catch (error) {
      const message = error?.message || "Failed to load todos";
      setErrorMessage(message);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setIsLoading(true);
      await fetchTodos();
      if (isMounted) setIsLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchTodos]);

  const filteredTodos = useMemo(() => {
    if (!searchQuery.trim()) return todos;
    const q = searchQuery.trim().toLowerCase();
    return todos.filter((item) => {
      const title = String(item?.title ?? item?.name ?? "").toLowerCase();
      return title.includes(q);
    });
  }, [todos, searchQuery]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchTodos();
    setIsRefreshing(false);
  }, [fetchTodos]);

  const confirmDelete = useCallback(async () => {
    const id = deleteTarget?.id;
    if (!id) return;
    try {
      setIsDeleting(true);
      await supabase.from("todos").delete().eq("id", id);
      await fetchTodos();
    } catch (e) {
      console.log("Delete todo error:", e?.message || e);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, fetchTodos]);

  const toggleComplete = useCallback(
    async (todo) => {
      try {
        const id = todo?.id;
        if (!id) return;
        // Only allow toggling to completed; do nothing if already completed
        if (todo?.is_completed === true) return;
        const nextCompleted = true;
        await supabase
          .from("todos")
          .update({ is_completed: nextCompleted })
          .eq("id", id);
        await fetchTodos();
      } catch (e) {
        console.log("Toggle complete error:", e?.message || e);
      }
    },
    [fetchTodos]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        todos={todos}
        onPressCreate={() => {
          setEditingTodo(null);
          setIsCreateOpen(true);
        }}
      />
      <View style={styles.wrapper}>
        <View style={styles.searchBox}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <SvgIcons name={"search"} size={24} color="#888" />
          </View>
        </View>
        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size={"large"} color="#3b82f6" />
          </View>
        ) : (
          <FlatList
            data={filteredTodos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FlatListRenderItem
                item={item}
                setEditingTodo={setEditingTodo}
                setIsCreateOpen={setIsCreateOpen}
                setDeleteTarget={setDeleteTarget}
                setIsDeleteOpen={setIsDeleteOpen}
                onPressReminder={(todo) => {
                  setReminderTarget(todo);
                  setReminderDate(null);
                  setIsReminderOpen(true);
                }}
                onToggleComplete={toggleComplete}
              />
            )}
            contentContainerStyle={{ paddingVertical: 12, paddingBottom: 170 }}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.fallback}>
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                <Text style={styles.fallbackText}>
                  No tasks have been added yet.
                </Text>
                <TouchableOpacity
                  style={styles.createBtn}
                  onPress={() => {
                    setEditingTodo(null);
                    setIsCreateOpen(true);
                  }}
                >
                  <Text style={styles.createBtnText}>Create</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>
      <CreateTodoModal
        visible={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingTodo(null);
        }}
        onCreated={fetchTodos}
        onUpdated={fetchTodos}
        initialTodo={editingTodo}
      />
      <ReminderModal
        visible={isReminderOpen}
        onClose={() => {
          setIsReminderOpen(false);
          setReminderTarget(null);
          setReminderDate(null);
        }}
        initialDate={reminderDate}
        onConfirm={async (date) => {
          setReminderDate(date);
          setIsReminderOpen(false);
          if (!date || !reminderTarget) return;
          try {
            const trigger = date;
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Task Reminder",
                body: `Don't forgot: ${reminderTarget?.title || "Task"}`,
                data: { todoId: reminderTarget?.id },
              },
              trigger,
            });
          } catch (e) {
            console.log("Schedule notification error:", e?.message || e);
          }
        }}
      />
      <DeleteConfirmModal
        visible={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
        isSubmitting={isDeleting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    width: "100%",
  },
  searchBox: {
    paddingVertical: 12,
  },
  inputWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
  },
  input: {
    width: "90%",
    fontFamily: "poppins-regular",
  },
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 300,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontFamily: "poppins-bold",
    fontSize: 18,
    marginTop: 150,
  },
  errorText: {
    color: "#ef4444",
    fontFamily: "poppins-regular",
    marginTop: 24,
  },
  createBtn: {
    backgroundColor: "blue",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createBtnText: {
    color: "#fff",
    textTransform: "capitalize",
    fontFamily: "poppins-regular",
  },
});
