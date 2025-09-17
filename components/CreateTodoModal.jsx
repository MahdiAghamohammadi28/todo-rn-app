import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function CreateTodoModal({
  visible,
  onClose,
  onCreated,
  onUpdated,
  initialTodo,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = useMemo(
    () => !!(initialTodo && visible),
    [initialTodo, visible]
  );

  useEffect(() => {
    if (visible) {
      if (initialTodo) {
        setTitle(String(initialTodo?.title ?? initialTodo?.name ?? ""));
        setDescription(String(initialTodo?.description ?? ""));
        const initialPriority = String(
          initialTodo?.priority ?? "medium"
        ).toLowerCase();
        setPriority(
          ["low", "medium", "high"].includes(initialPriority)
            ? initialPriority
            : "medium"
        );
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
      }
    }
  }, [visible, initialTodo]);

  const resetAndClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setIsPriorityOpen(false);
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority,
      };
      if (isEditMode) {
        const id = initialTodo?.id ?? initialTodo?.uuid ?? initialTodo?._id;
        if (!id) throw new Error("Missing todo id for update");
        const { data: updatedRows, error } = await supabase
          .from("todos")
          .update(payload)
          .eq("id", id)
          .select("*")
          .single();
        if (error) throw error;
        resetAndClose();
        onUpdated?.(updatedRows);
      } else {
        const { data: createdRows, error } = await supabase
          .from("todos")
          .insert(payload)
          .select("*")
          .single();
        if (error) throw error;
        resetAndClose();
        onCreated?.(createdRows);
      }
    } catch (e) {
      console.log(
        isEditMode ? "Update todo error:" : "Create todo error:",
        e?.message || e
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={resetAndClose}
    >
      <View style={styles.modalBackdrop}>
        <KeyboardAvoidingView behavior="height" style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {isEditMode ? "Edit Task" : "Create Task"}
          </Text>
          <View style={styles.modalInputWrapper}>
            <TextInput
              style={styles.modalInput}
              placeholder="Title"
              placeholderTextColor="#888"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={[styles.modalInputWrapper, { height: 96 }]}>
            <TextInput
              style={[styles.modalInput, { height: 96, verticalAlign: "top" }]}
              placeholder="Description (optional)"
              placeholderTextColor="#888"
              multiline
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <Text style={styles.modalLabel}>Priority</Text>
          <View style={styles.selectWrapper}>
            <TouchableOpacity
              style={styles.selectButton}
              activeOpacity={0.8}
              onPress={() => setIsPriorityOpen((v) => !v)}
            >
              <Text style={styles.selectButtonText}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
            {isPriorityOpen ? (
              <View style={styles.selectMenu}>
                {["low", "medium", "high"].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.selectOption}
                    onPress={() => {
                      setPriority(opt);
                      setIsPriorityOpen(false);
                    }}
                  >
                    <Text style={styles.selectOptionText}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancel]}
              onPress={resetAndClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.modalBtnText, { color: "#282828" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCreate]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.modalBtnText}>
                {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,

    padding: 16,
  },
  modalTitle: {
    fontFamily: "poppins-bold",
    fontSize: 18,
    marginBottom: 12,
  },
  modalInputWrapper: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#282828",
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  modalInput: {
    fontFamily: "poppins-regular",
  },
  modalLabel: {
    fontFamily: "poppins-regular",
    color: "#282828",
    marginBottom: 6,
    marginTop: 2,
  },
  selectWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  selectButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#282828",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  selectButtonText: {
    fontFamily: "poppins-regular",
    color: "#111827",
  },
  selectMenu: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#d1d5db",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 10,
    elevation: 4,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectOptionText: {
    fontFamily: "poppins-regular",
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCancel: {
    backgroundColor: "#e5e7eb",
  },
  modalCreate: {
    backgroundColor: "#4f46e5",
  },
  modalBtnText: {
    color: "#fff",
    fontFamily: "poppins-regular",
  },
});
