import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppBottomSheet } from "../ui/AppBottomSheet";

export interface PaymentModalsProps {
  visible: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

type PaymentStep = "methodSelect" | "cardForm" | "bankTransfer";

export const PaymentModals: React.FC<PaymentModalsProps> = ({
  visible,
  onClose,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<PaymentStep>("methodSelect");

  // Card Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  // Bank Copy Toast
  const [copied, setCopied] = useState(false);

  const handleCopyAccount = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseAll = () => {
    setStep("methodSelect");
    onClose();
  };

  return (
    <>
      {/* 1. Payment Method Selection Sheet */}
      <AppBottomSheet
        visible={visible && step === "methodSelect"}
        onClose={handleCloseAll}
        title="Choose a Payment Method"
        maxHeight="75%"
      >
        <View style={styles.methodList}>
          {/* Wallet */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={onPaymentSuccess}
          >
            <Ionicons name="wallet-outline" size={22} color="#0F172A" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.methodTitle}>Pay with Wallet</Text>
              <Text style={styles.methodSub}>Current Balance: N10,000</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Card */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => setStep("cardForm")}
          >
            <Ionicons name="card-outline" size={22} color="#0F172A" style={{ marginRight: 12 }} />
            <Text style={styles.methodTitleFlex}>Pay with Card</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Bank Transfer */}
          <TouchableOpacity
            style={styles.methodCard}
            onPress={() => setStep("bankTransfer")}
          >
            <Ionicons name="business-outline" size={22} color="#0F172A" style={{ marginRight: 12 }} />
            <Text style={styles.methodTitleFlex}>Pay with Bank Transfer</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* PayPal */}
          <TouchableOpacity style={styles.methodCard} onPress={onPaymentSuccess}>
            <Ionicons name="logo-paypal" size={22} color="#003087" style={{ marginRight: 12 }} />
            <Text style={styles.methodTitleFlex}>Pay with PayPal</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Stripe */}
          <TouchableOpacity style={styles.methodCard} onPress={onPaymentSuccess}>
            <Ionicons name="card" size={22} color="#635BFF" style={{ marginRight: 12 }} />
            <Text style={styles.methodTitleFlex}>Pay with Stripe</Text>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </AppBottomSheet>

      {/* 2. Pay with Card Form Sheet */}
      <AppBottomSheet
        visible={visible && step === "cardForm"}
        onClose={() => setStep("methodSelect")}
        title="Pay with Card"
        maxHeight="85%"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.scanCardBtn}>
            <Ionicons name="scan-outline" size={18} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={styles.scanCardText}>Scan Card</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.fieldLabel}>Card Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="card-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInput}
              placeholder="0000-0000-0000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
          </View>

          <View style={styles.rowTwoCols}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Expires</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM/YY"
                  placeholderTextColor="#94A3B8"
                  value={expiry}
                  onChangeText={setExpiry}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <Ionicons name="information-circle-outline" size={14} color="#94A3B8" style={{ marginLeft: 4 }} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder="000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                  value={cvv}
                  onChangeText={setCvv}
                />
              </View>
            </View>
          </View>

          <Text style={styles.fieldLabel}>Name on Card</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g John Doe"
              placeholderTextColor="#94A3B8"
              value={cardName}
              onChangeText={setCardName}
            />
          </View>

          <TouchableOpacity style={styles.checkboxRow} onPress={() => setSaveCard(!saveCard)}>
            <Ionicons
              name={saveCard ? "checkbox" : "square-outline"}
              size={18}
              color={saveCard ? "#375DFB" : "#94A3B8"}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.checkboxLabel}>Save for next time</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.payBtn} onPress={onPaymentSuccess}>
            <Text style={styles.payBtnText}>Pay</Text>
          </TouchableOpacity>
        </ScrollView>
      </AppBottomSheet>

      {/* 3. Pay with Bank Transfer Sheet */}
      <AppBottomSheet
        visible={visible && step === "bankTransfer"}
        onClose={() => setStep("methodSelect")}
        title="Pay with Bank Transfer"
        maxHeight="75%"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Amount Header Card */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount to be paid</Text>
            <Text style={styles.amountValue}>N150,000</Text>
          </View>

          {/* Bank Details Table */}
          <View style={styles.bankTable}>
            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Bank Name</Text>
              <Text style={styles.bankValue}>Zenith</Text>
            </View>

            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Number</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.bankValue}>0000000000</Text>
                <TouchableOpacity onPress={handleCopyAccount} style={{ marginLeft: 8 }}>
                  <Ionicons name="copy-outline" size={16} color="#375DFB" />
                </TouchableOpacity>
              </View>
            </View>

            {copied && <Text style={styles.copiedText}>Account Number Copied!</Text>}

            <View style={styles.bankRow}>
              <Text style={styles.bankLabel}>Account Name</Text>
              <Text style={styles.bankValue}>Drifully</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmPayBtn} onPress={onPaymentSuccess}>
            <Text style={styles.confirmPayText}>Confirm Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </AppBottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  methodList: { gap: 10, paddingBottom: 16 },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  methodTitle: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  methodTitleFlex: { flex: 1, fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },
  methodSub: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B", marginTop: 2 },

  /* Card Form Styles */
  scanCardBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  scanCardText: { fontFamily: "DM Sans Bold", fontSize: 14, color: "#0F172A" },

  dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  dividerText: { fontFamily: "DM Sans", fontSize: 12, color: "#94A3B8", marginHorizontal: 12 },

  fieldLabel: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A", marginBottom: 6, marginTop: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  textInput: { flex: 1, fontFamily: "DM Sans", fontSize: 14, color: "#0F172A", paddingVertical: 0, height: "100%" },

  rowTwoCols: { flexDirection: "row", gap: 12 },

  checkboxRow: { flexDirection: "row", alignItems: "center", marginVertical: 14 },
  checkboxLabel: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },

  payBtn: { backgroundColor: "#F1F5F9", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 20 },
  payBtnText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#94A3B8" },

  /* Bank Transfer Styles */
  amountCard: { backgroundColor: "#F8FAFC", borderRadius: 14, padding: 16, alignItems: "center", marginBottom: 16 },
  amountLabel: { fontFamily: "DM Sans", fontSize: 12, color: "#64748B" },
  amountValue: { fontFamily: "DM Sans Bold", fontSize: 24, color: "#0F172A", marginTop: 4 },

  bankTable: { marginBottom: 20 },
  bankRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  bankLabel: { fontFamily: "DM Sans", fontSize: 13, color: "#64748B" },
  bankValue: { fontFamily: "DM Sans Bold", fontSize: 13, color: "#0F172A" },
  copiedText: { fontFamily: "DM Sans Bold", fontSize: 11, color: "#21C650", textAlign: "right", marginTop: 4 },

  confirmPayBtn: { backgroundColor: "#375DFB", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 20 },
  confirmPayText: { fontFamily: "DM Sans Bold", fontSize: 15, color: "#FFFFFF", fontWeight: "700" },
});
