import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  isSubmitting,
  title = "Delete task",
  message = "Are you sure you want to delete this task?",
}) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancel]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.modalBtnText, { color: "#282828" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalDelete]}
              onPress={onConfirm}
              disabled={isSubmitting}
            >
              <Text style={styles.modalBtnText}>
                {isSubmitting ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
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
    marginBottom: 8,
  },
  modalMessage: {
    fontFamily: "poppins-regular",
    color: "#374151",
    marginBottom: 16,
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
  modalDelete: {
    backgroundColor: "#ef4444",
  },
  modalBtnText: {
    color: "#fff",
    fontFamily: "poppins-regular",
  },
});
