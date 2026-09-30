import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface DriverChatScreenProps {
  visible: boolean;
  onClose: () => void;
  onCallDriver?: () => void;
  driverName?: string;
}

interface MessageItem {
  id: string;
  text: string;
  sender: "rider" | "driver";
  time: string;
}

export const DriverChatScreen: React.FC<DriverChatScreenProps> = ({
  visible,
  onClose,
  onCallDriver,
  driverName = "Edward Prosper",
}) => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: MessageItem = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "rider",
      time: "10:11 AM",
    };
    setMessages([...messages, newMsg]);
    setInputText("");
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left", "right"]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{driverName}</Text>
            <TouchableOpacity onPress={onCallDriver} style={styles.iconBtn}>
              <Ionicons name="call-outline" size={22} color="#0F172A" />
            </TouchableOpacity>
          </View>

          {/* Messages Area */}
          <View style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <View style={styles.emptyPlaceholder}>
                <Text style={styles.emptyText}>Say hi to Prosper</Text>
              </View>
            ) : (
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                renderItem={({ item }) => (
                  <View style={[styles.bubbleWrapper, item.sender === "rider" ? styles.bubbleRider : styles.bubbleDriver]}>
                    <View style={[styles.bubble, item.sender === "rider" ? styles.bubbleRiderBg : styles.bubbleDriverBg]}>
                      <Text style={[styles.bubbleText, item.sender === "rider" ? styles.bubbleRiderText : styles.bubbleDriverText]}>
                        {item.text}
                      </Text>
                    </View>
                    <Text style={styles.timeStamp}>{item.time}</Text>
                  </View>
                )}
              />
            )}
          </View>

          {/* Bottom Chat Input Bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn}>
              <Ionicons name="add" size={24} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.textInputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message"
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity style={styles.cameraIconBtn}>
                <Ionicons name="camera-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {inputText.trim().length > 0 && (
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconBtn: { padding: 4 },
  headerTitle: { fontFamily: "DM Sans Bold", fontSize: 18, fontWeight: "700", color: "#0F172A" },

  messagesContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  emptyPlaceholder: { flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 24 },
  emptyText: { fontFamily: "DM Sans", fontSize: 13, color: "#94A3B8" },

  messageList: { padding: 16, gap: 12 },
  bubbleWrapper: { maxWidth: "80%", marginBottom: 8 },
  bubbleRider: { alignSelf: "flex-end", alignItems: "flex-end" },
  bubbleDriver: { alignSelf: "flex-start", alignItems: "flex-start" },

  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleRiderBg: { backgroundColor: "#EFF6FF", borderBottomRightRadius: 4 },
  bubbleDriverBg: { backgroundColor: "#F8FAFC", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#E2E8F0" },

  bubbleText: { fontFamily: "DM Sans", fontSize: 14 },
  bubbleRiderText: { color: "#0F172A" },
  bubbleDriverText: { color: "#0F172A" },
  timeStamp: { fontFamily: "DM Sans", fontSize: 10, color: "#94A3B8", marginTop: 4 },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  attachBtn: { padding: 4 },
  textInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textInput: { flex: 1, fontFamily: "DM Sans", fontSize: 14, color: "#0F172A", paddingVertical: 0, height: "100%" },
  cameraIconBtn: { padding: 4 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#375DFB",
    justifyContent: "center",
    alignItems: "center",
  },
});
