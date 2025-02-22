import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Platform, ActivityIndicator, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BASE_URL } from "../constants/config";
import { Authcontext } from "../context/AuthProvider";
import { ToastifyModal } from "../Modal/StatusModal";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

const Analytics = () => {
  const { userToken } = useContext<any>(Authcontext);
  const [selectedTab, setSelectedTab] = useState<"sales" | "products">("sales");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("start");
  const [isSalesDataLoading, setIsSalesDataLoading] = useState<boolean>(false);
  const [isProductDataLoading, setIsProductDataLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSalesData();
    fetchProductData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchSalesData();
    }
  }, [startDate, endDate]);

  const fetchSalesData = async () => {
    setIsSalesDataLoading(true);
    try {
      let url = `${BASE_URL}/api/stock/sales-report`;

      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: userToken, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to fetch sales data: ${response.statusText}`);
      const data = await response.json();
      setSalesData(data);
    } catch (err: any) {
      showToast(err.message, false);
    }
    finally {
      setIsSalesDataLoading(false);
    }
  };

  const fetchProductData = async () => {
    setIsProductDataLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/stock`, {
        method: "GET",
        headers: { Authorization: userToken, "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to fetch product data: ${response.statusText}`);
      const data = await response.json();
      setProductData(data);
    } catch (err: any) {
      showToast(err.message, false);
    }
    finally {
      setIsProductDataLoading(false);
    }
  };

  const showToast = (msg: string, success: boolean) => {
    setMessage(msg);
    setIsSuccessful(success);
    setShowModal(true);
  };

  const handleDateChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (pickerMode === "start") setStartDate(selectedDate || startDate);
    else setEndDate(selectedDate || endDate);
  };

  //------------------- Generate report --------------------------------------------------------- 

  const [isGenerateReportModalVisible, setIsGenerateReportModalVisible] = useState<boolean>(false);

  const handleGenerateReportButton = () => {
    setIsGenerateReportModalVisible(true);
  }

  const openDownloadedFile = async (fileUri: string) => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri);
        } else {
          console.error("Sharing is not available on this device.");
        }
      } catch (error) {
        console.error("Error sharing file:", error);
      }
    }
  };

  const blobToBase64 = (blob: any) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to convert blob to Base64"));
        }
      };

      reader.onerror = (error) => reject(error);
    });
  };


  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/stock/sales-report/download`, {
        method: "GET",
        headers: {
          Authorization: userToken,
        },
      });

      if (!response.ok) {
        showToast("Error: Failed to generate report", false);
        return;
      }

      const blob = await response.blob();

      const fileUri = `${FileSystem.cacheDirectory}sales_report.xlsx`;

      const base64Data = await blobToBase64(blob);

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await openDownloadedFile(fileUri);

    } catch (error) {
      console.error("Download error:", error);
      showToast("Error: Failed to download the report.", false);
    } finally {
      setIsGenerateReportModalVisible(false);
    }
  };


  return (
    <View style={styles.container}>
      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "sales" && styles.activeTab]}
          onPress={() => setSelectedTab("sales")}
        >
          <Text style={[styles.tabText, selectedTab === "sales" && styles.activeTabText]}>Sales</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, selectedTab === "products" && styles.activeTab]}
          onPress={() => setSelectedTab("products")}
        >
          <Text style={[styles.tabText, selectedTab === "products" && styles.activeTabText]}>Products</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Section (Only for Sales) */}
      {selectedTab === "sales" && (
        <>
          <TouchableOpacity style={styles.option} onPress={handleGenerateReportButton}>
            <MaterialIcons name="create-new-folder" size={30} color="#FF4C4C" />
            <Text style={styles.optionText}>Generate report</Text>
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            {["start", "end"].map(mode => (
              <TouchableOpacity key={mode} style={styles.datePicker} onPress={() => { setPickerMode(mode); setShowPicker(true); }}>
                <FontAwesome name="calendar" size={20} color="#FF4C4C" />
                <Text style={styles.dateText}>
                  {mode === "start"
                    ? startDate ? startDate.toDateString() : "Select Start Date"
                    : endDate ? endDate.toDateString() : "Select End Date"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </>
      )}

      {showPicker && (
        <DateTimePicker
          value={pickerMode === "start"
            ? startDate || new Date()
            : endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}


      {/* Render Sales or Products based on selectedTab */}
      {selectedTab === "sales" ? (
        <>
          <Text style={styles.sectionTitle}>Sales Report</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Product</Text>
            <Text style={styles.headerCell}>Quantity Sold</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Date</Text>
          </View>

          {
            isSalesDataLoading ? <ActivityIndicator color='#FF4C4C' size={28} style={{ marginVertical: 'auto' }} /> :
              <ScrollView style={styles.table}>{renderSalesTable(salesData)}</ScrollView>
          }
        </>
      ) : (
        <>
          <Text style={[styles.sectionTitle, { marginBottom: 3 }]}>Product Stock </Text>
          <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, marginBottom: 7 }}>{formatDate()}</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Product</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Quantity Remaining</Text>
          </View>
          {
            isProductDataLoading ? <ActivityIndicator color='#FF4C4C' size={28} style={{ marginVertical: 'auto' }} /> :
              <View style={styles.table}>{renderProductTable(productData)}</View>
          }
        </>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isGenerateReportModalVisible}
        onRequestClose={() => setIsGenerateReportModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select date range of report</Text>
            <Ionicons
              name="close-circle"
              size={25}
              color="#FF362E"
              onPress={() => setIsGenerateReportModalVisible(false)}
              style={styles.closeIcon}
            />

            <View style={[styles.dateContainer, { gap: 5, marginHorizontal: 'auto' }]}>
              {["start", "end"].map(mode => (
                <TouchableOpacity key={mode} style={styles.datePicker} onPress={() => { setPickerMode(mode); setShowPicker(true); }}>
                  <FontAwesome name="calendar" size={20} color="#FF4C4C" />
                  <Text style={styles.dateText}>
                    {mode === "start"
                      ? startDate ? startDate.toDateString() : "Select Start Date"
                      : endDate ? endDate.toDateString() : "Select End Date"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleGenerateReport}
              style={[styles.button]}>
              <Text
                style={styles.buttonText}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ToastifyModal visible={showModal} onClose={() => setShowModal(false)} message={message} isSuccessful={isSuccessful} />
    </View>
  );
};

const formatDate = (dateString?: string) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};


const renderSalesTable = (data: any[]) => (
  <ScrollView>
    {data.length > 0 ? (
      data.map((item, index) => (
        <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}>
          <Text style={styles.tableCell}>{item?.productName}</Text>
          <Text style={styles.tableCell}>{item?.quantitySold}</Text>
          <Text style={styles.tableCell}>{item?.totalAmount}</Text>
          <Text style={styles.tableCell}>{formatDate(item?.saleDate)}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No data available</Text>
    )}
  </ScrollView>
);

const renderProductTable = (data: any[]) => (
  <ScrollView>

    {data.length > 0 ? (
      data.map((item, index) => (
        <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}>
          <Text style={styles.tableCell}>{item?.productName}</Text>
          <Text style={styles.tableCell}>{item?.quantityRemaining}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.noDataText}>No data available</Text>
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    marginTop: 20,
    marginBottom: 63,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "transparent"
  },
  activeTab: {
    borderBottomColor: "#FF4C4C"
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555"
  },
  activeTabText: {
    color: "#FF4C4C"
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 2
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333"
  },
  option: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 10,
    marginBottom: 10
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500'
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: 'center'
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden"
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#FF4C4C",
    paddingVertical: 10
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 3
  },
  tableRowAlternate: {
    backgroundColor: "#f5f5f5"
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 13,
    color: "#333"
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingVertical: 8,
    fontSize: 15
  },
  noDataText: {
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    color: "#777"
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center'
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  closeIcon: {
    position: "absolute",
    top: 15,
    right: 20,
    padding: 5,
    borderRadius: 15,
    backgroundColor: "#f1f1f1",
  },
});

export default Analytics;
