import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal,Image } from "react-native";
import CustomSlider from "../helper/CustomSlider"
import { postTransactions } from '../api/index';
import { Picker } from '@react-native-picker/picker';
const ExpenseForm = ({ navigation }) => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [amount, setAmount] = useState(0);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [interval, setInterval] = useState("monthly");
  const [showIntervalInfo, setShowIntervalInfo] = useState(false);
  const allowedCategories = [
     'transfer',
     'payment',
     'withdrawal',
     'purchase'
   ];
   const validateCategory = (input) => {
     if (!allowedCategories.includes(input.toLowerCase())) {
       setCategoryError('Invalid category. Allowed values: transfer, payment, withdrawal, purchase');
       return false;
     }
     setCategoryError('');
     return true;
   };
 
   const handleSubmit = async () => {
     setCategoryError('');
     // Validate category
     if (!validateCategory(category)) {
       return;
     }
     if (!description || amount <= 0) {
       alert("Please fill all required fields");
       return;
     }
     try {
       const transactionData = {
         amount:Number(amount),
         type:"expense",
         description:description,
         category: category,
         isRecurring: isRecurring,
        interval: isRecurring ? interval : undefined,
       };
       console.log(transactionData)
       await postTransactions(transactionData);
       setIsSuccessPopupVisible(true);  
     } catch (error) {
       console.error("Transaction error:", error);
       alert(`Transaction failed: ${error.error || error.message}`);
     }
   };
 
   const closePopup = () => {
     setIsSuccessPopupVisible(false);
     navigation.goBack(); 
   };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add A New Expense</Text>

      {/* Description Input */}
      <TextInput
        style={styles.input}
        placeholderTextColor="#888888"
        placeholder="Type What is the depense (e.g., Spotify, Netflix, House)"
        value={description}
        onChangeText={setDescription}
      />

      {/* Category Input */}
      <TextInput
        style={styles.input}
         placeholder="Valid categories: transfer, payment, deposit, withdrawal, purchase"
        value={category}
        placeholderTextColor="#888888"
        onChangeText={(text) => {
          setCategory(text.toLowerCase());
          validateCategory(text);
        }}
      />
      {/* Recurring Section */}
            <View style={styles.section}>
              <TouchableOpacity 
                style={styles.recurringContainer}
                onPress={() => setIsRecurring(!isRecurring)}
                activeOpacity={0.7}
              >
                <View style={styles.checkbox}>
                  {isRecurring && <View style={styles.checkboxInner} />}
                </View>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>Periodic</Text>
                  <TouchableOpacity 
                    onPress={() => setShowIntervalInfo(!showIntervalInfo)}
                    style={styles.infoIcon}
                  >
                    <Text style={styles.infoIconText}>ⓘ</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
      
              {showIntervalInfo && (
                <Text style={styles.tooltip}>
                  Enable for recurring transactions (e.g., monthly subscriptions)
                </Text>
              )}
      
              {isRecurring && (
                <View style={styles.intervalContainer}>
                  <View style={styles.pickerWrapper}>
                    <Picker
                     selectedValue={interval}
                    onValueChange={(itemValue) => setInterval(itemValue)}
                    style={styles.picker}
                    mode="dropdown"
                    >
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                    </Picker>
                  </View>
                </View>
              )}
            </View>
     {/* Amount Slider */}
     <Text style={styles.amountText}>Amount: ${amount.toFixed(2)}</Text>
      <View style={styles.amount_Container}>
      <CustomSlider
        minValue={0}
        maxValue={10000}
        step={100}
        onValueChange={setAmount}
        minimumTrackTintColor="#0066FF"
        maximumTrackTintColor="#A2A2A7"
      />
      <View style={styles.amountLabels}>
        <Text style={styles.amountLabel}>$0</Text>
        <Text style={styles.amountLabel}>$4,600</Text>
        <Text style={styles.amountLabel}>$10,000</Text>
      </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addButtonText}>Add +</Text>
      </TouchableOpacity>

      {/* Success Popup */}
      <Modal
        visible={isSuccessPopupVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePopup}
      >
        <View style={styles.popupContainer}>
          <View style={styles.popupContent}>
            <Text style={styles.popupTitle}>Ajout Avec Success</Text>
            <Text style={styles.popupText}>
              Le Dépense <Text style={styles.boldText}>{description}</Text> dans la catégorie{" "}
              <Text style={styles.boldText}>{category}</Text> a été ajouté avec success.
            </Text>
            <Image source={require("../assets/done.png")} style={styles.popup_image} />
            <TouchableOpacity style={styles.popupButton} onPress={closePopup}>
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap:12,
    padding:25,
    backgroundColor: "#161622",
  },
  title: {
    fontSize: 24,
    textAlign:"center",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#333333",
    marginBottom: 20,
    color: "#fff",
  },
  recurringContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2D',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#0066FF',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  infoIcon: {
    marginLeft: 4,
  },
  tooltip: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#374151',
    marginTop: 4,
  },
  intervalContainer: {
    marginTop: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd6fe',
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
  },
  picker: {
    height: 48,
    color: '#374151',
  },
   infoIconText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  amount_Container:{
    backgroundColor:"#1E1E2D",
    borderRadius:20,
    paddingHorizontal:25,
    paddingVertical:10,
  },
  amountText: {
    fontSize: 16,
    color: "#fff",
  },
  amountLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountLabel: {
    fontSize: 14,
    color: "#A2A2A7",
  },
  addButton: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 8,
    marginTop:50,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "#1E1E2D",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  popupText: {
    fontSize: 16,
    color: "#A2A2A7",
    marginBottom: 10,
    textAlign: "center",
  },
  popup_image:{
    width: 40, 
    height: 40,
    borderRadius: 50,
    marginBottom:10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#FF2366",
  },
  popupSubtext: {
    fontSize: 14,
    color: "#A2A2A7",
    marginBottom: 20,
  },
  popupButton: {
    backgroundColor: "#0066FF",
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});



export default ExpenseForm;