import SvgIcons from "@/contants/SvgIcons";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FlatListRenderItem({
  item,
  setEditingTodo,
  setIsCreateOpen,
  setDeleteTarget,
  setIsDeleteOpen,
  onToggleComplete,
}) {
  const getPriorityStyle = useCallback((priority, isCompleted) => {
    if (isCompleted === true) {
      return {
        backgroundColor: "#f3f3f3",
        borderColor: "#f3f3f3",
        borderLeftColor: "#00b14a",
      };
    }
    const p = String(priority || "medium").toLowerCase();
    switch (p) {
      case "high":
        return {
          backgroundColor: "#f3f3f3",
          borderColor: "#f3f3f3",
          borderLeftColor: "#ef4444",
        };
      case "low":
        return {
          backgroundColor: "#f3f3f3",
          borderColor: "#f3f3f3",
          borderLeftColor: "#01c7f8",
        };
      case "medium":
      default:
        return {
          backgroundColor: "#f3f3f3",
          borderColor: "#f3f3f3",
          borderLeftColor: "#f59e0b",
        };
    }
  }, []);

  const handleEdit = useCallback(
    (item) => {
      setEditingTodo(item);
      setIsCreateOpen(true);
    },
    [setEditingTodo, setIsCreateOpen]
  );
  const handleDelete = useCallback(
    (item) => {
      const id = item?.id;
      if (!id) return;
      setDeleteTarget(item);
      setIsDeleteOpen(true);
    },
    [setDeleteTarget, setIsDeleteOpen]
  );

  return (
    <View
      style={[
        styles.todoItem,
        getPriorityStyle(item?.priority, item?.is_completed),
      ]}
    >
      <View>
        <Text style={styles.todoTitle} numberOfLines={1}>
          {item?.title ?? "Untitled"}
        </Text>
        <Text style={styles.todoDescription} numberOfLines={2}>
          {item?.description ?? ""}
        </Text>
        <Text style={styles.todoComplete}>
          {item?.is_completed === true ? "Completed" : "Not completed"}
        </Text>
      </View>
      <View style={styles.actionBtns}>
        <TouchableOpacity
          onPress={() => onToggleComplete?.(item)}
          disabled={item?.is_completed === true}
        >
          <SvgIcons
            name={item?.is_completed === true ? "checked" : "check-mark"}
            size={16}
            color={item?.is_completed === true ? "#10b981" : "#282828"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <SvgIcons name="edit" size={16} color={"#282828"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <SvgIcons name="trash" size={16} color="#b91c1c" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    borderLeftWidth: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 3,
  },
  todoTitle: {
    fontFamily: "poppins-bold",
    fontSize: 16,
    color: "#111827",
  },
  todoDescription: {
    marginTop: 2,
    fontFamily: "poppins-regular",
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  todoComplete: {
    fontFamily: "poppins-regular",
    fontSize: 14,
    color: "#888",
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
