import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReminderModal({
  visible,
  onClose,
  onConfirm,
  initialDate,
  title = "Set reminder",
}) {
  const [step, setStep] = useState("date"); // "date" | "time"
  const [tempDate, setTempDate] = useState(() =>
    initialDate ? new Date(initialDate) : new Date()
  );

  const displayLabel = useMemo(() => {
    try {
      return tempDate.toLocaleString();
    } catch {
      return "";
    }
  }, [tempDate]);

  const closeAndReset = () => {
    setStep("date");
    onClose?.();
  };

  const handleChange = (_event, selected) => {
    if (selected) {
      setTempDate(selected);
    }
  };

  const nextOrConfirm = () => {
    if (step === "date") {
      setStep("time");
      return;
    }
    onConfirm?.(tempDate);
    setStep("date");
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={closeAndReset}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.subtitle}>
            Choose {step === "date" ? "date" : "time"}
          </Text>

          <View style={styles.pickerWrapper}>
            <DateTimePicker
              value={tempDate}
              mode={step === "date" ? "date" : "time"}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleChange}
              minimumDate={new Date()}
            />
          </View>

          <Text style={styles.preview}>{displayLabel}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.cancel]}
              onPress={closeAndReset}
            >
              <Text style={[styles.btnText, { color: "#282828" }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.primary]}
              onPress={nextOrConfirm}
            >
              <Text style={styles.btnText}>
                {step === "date" ? "Next" : "Set"}
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
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "poppins-regular",
    color: "#374151",
    marginBottom: 12,
  },
  pickerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  preview: {
    textAlign: "center",
    marginVertical: 8,
    fontFamily: "poppins-regular",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancel: {
    backgroundColor: "#e5e7eb",
  },
  primary: {
    backgroundColor: "#4f46e5",
  },
  btnText: {
    color: "#fff",
    fontFamily: "poppins-regular",
  },
});
