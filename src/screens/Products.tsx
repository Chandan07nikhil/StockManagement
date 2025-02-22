import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, StyleSheet, Modal, TextInput, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../constants/config";
import { Authcontext } from "../context/AuthProvider";
import { ToastifyModal } from "../Modal/StatusModal";

const Products = () => {

  const { userToken, userInfo } = useContext<any>(Authcontext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const [products, setProducts] = useState<any>();
  const [isProductDataLoading, setIsProductDataLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsProductDataLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/stock`, {
        method: "GET",
        headers: new Headers({
          Authorization: userToken,
          "Content-Type": "application/json",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      if (data) {
        setProducts(data);
      }
    } catch (err) {
      setMessage('Failed to fetch products. Please try again.');
      setIsSuccessful(false);
      setShowModal(true);
    }
    finally {
      setIsProductDataLoading(false);
    }
  };

  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState<boolean>(false);
  const [productName, setProductName] = useState<string>('');
  const [productQuantity, setProductQuantity] = useState<number | ''>(0);
  const [price, setPrice] = useState<string>('');
  const [productNameError, setProductNameError] = useState<boolean>(false);
  const [productNameTouched, setProductNameTouched] = useState<boolean>(false);
  const [productQuantityError, setProductQuantityError] = useState<boolean>(false);
  const [productQuantityTouched, setProductQuantityTouched] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<boolean>(false);
  const [priceTouched, setPriceTouched] = useState<boolean>(false);

  const [isAddStockModalVisible, setIsAddStockModalVisible] = useState<boolean>(false);
  const [addStockQuantity, setAddStockQuantity] = useState<string>('');
  const [addStockQuantityError, setAddStockQuantityError] = useState<boolean>(false);
  const [addStockQuantityTouched, setAddStockQuantityTouched] = useState<boolean>(false);

  const [isSellStockModalVisible, setIsSellStockModalVisible] = useState<boolean>(false);
  const [sellStockQuantity, setSellStockQuantity] = useState<string>('');
  const [sellStockQuantityError, setSellStockQuantityError] = useState<boolean>(false);
  const [sellStockQuantityTouched, setSellStockQuantityTouched] = useState<boolean>(false);

  const [isDeleteProductModalVisible, setIsDeleteProductModalVisible] = useState<boolean>(false);


  const handleAddProductButton = () => {
    setIsAddProductModalVisible(true);
  }

  const [addStockId, setAddStockId] = useState<string>('');
  const handleAddStockButton = (id: string) => {
    setAddStockId(id);
    setIsAddStockModalVisible(true);
  }

  const [sellStockId, setSellStockId] = useState<string>('');
  const handleSellStockButton = (id: string) => {
    setSellStockId(id);
    setIsSellStockModalVisible(true);
  }

  const [deleteStockId, setDeleteStockId] = useState<string>('');
  const handleDeleteProductButton = (id: string) => {
    setDeleteStockId(id);
    setIsDeleteProductModalVisible(true);
  }

  const closeAddProductModal = () => {
    setProductNameTouched(false);
    setProductNameError(false);
    setProductQuantityTouched(false);
    setProductQuantityError(false);
    setPriceTouched(false);
    setPriceError(false);
    setIsAddProductModalVisible(false);
  }

  const closeAddStockModal = () => {
    setAddStockQuantityTouched(false);
    setAddStockQuantityError(false);
    setIsAddStockModalVisible(false);
  }

  const closeSellStockModal = () => {
    setSellStockQuantityTouched(false);
    setSellStockQuantityError(false);
    setIsSellStockModalVisible(false);
  }

  const handleAddProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/stock/add`, {
        method: "POST",
        headers: new Headers({
          Authorization: userToken,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ productName, quantityRemaining: productQuantity, cost: price })
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message === 'Stock item successfully added') {
        setMessage(`${data.message}`);
        setIsSuccessful(true);
        setShowModal(true);
        fetchProducts();
      }
    } catch (err: any) {
      setMessage(`${err.message}`);
      setIsSuccessful(false);
      setShowModal(true);
    }
    finally {
      setIsAddProductModalVisible(false);
      setProductName('');
      setProductQuantity(0);
      setPrice('');
    }
  }

  const handleAddStock = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/stock/${addStockId}/increase`, {
        method: "PUT",
        headers: new Headers({
          Authorization: userToken,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ quantity: Number(addStockQuantity) })
      });

      if (!response.ok) {
        throw new Error(`Failed to add stock: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message === 'Stock quantity successfully increased') {
        setMessage(`${data.message}`);
        setIsSuccessful(true);
        setShowModal(true);
        fetchProducts();
      }
    } catch (err: any) {
      setMessage(`${err.message}`);
      setIsSuccessful(false);
      setShowModal(true);
    }
    finally {
      setIsAddStockModalVisible(false);
      setAddStockQuantity('');
    }
  }

  const handleSellProduct = async () => {

    try {
      const response = await fetch(`${BASE_URL}/api/stock/${sellStockId}/decrease`, {
        method: "PUT",
        headers: new Headers({
          Authorization: userToken,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ quantity: Number(sellStockQuantity) })
      });

      if (!response.ok) {
        throw new Error(`Failed to sell stock: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message === 'Stock quantity successfully decreased') {
        setMessage(`${data.message}`);
        setIsSuccessful(true);
        setShowModal(true);
        fetchProducts();
      }
    } catch (err: any) {
      setMessage(`${err.message}`);
      setIsSuccessful(false);
      setShowModal(true);
    }
    finally {
      setIsSellStockModalVisible(false);
      setSellStockQuantity('');
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/stock/delete/${deleteStockId}`, {
        method: "DELETE",
        headers: new Headers({
          Authorization: userToken,
          "Content-Type": "application/json",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message === 'Stock item successfully deleted') {
        setMessage(`${data.message}`);
        setIsSuccessful(true);
        setShowModal(true);
        fetchProducts();
      }
    } catch (err: any) {
      setMessage(`${err.message}`);
      setIsSuccessful(false);
      setShowModal(true);
    }
    finally {
      setIsDeleteProductModalVisible(false);
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>PRODUCTS</Text>

      {userInfo?.isAdmin && <TouchableOpacity style={styles.option} onPress={handleAddProductButton}>
        <Ionicons name="add-sharp" size={30} color="#00BFFF" />
        <Text style={styles.optionText}>Add Product</Text>
      </TouchableOpacity>}
      {/* Product List */}
      {
        isProductDataLoading ?
          <ActivityIndicator color='#FF4C4C' size={30} style={{ marginVertical: 'auto' }} /> :
          (
            products && products.length > 0 ? (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.productName}>{item.productName}</Text>

                  {/* Price & Stock Tags */}
                  <View style={styles.tagsContainer}>
                    <View style={[styles.tag, { backgroundColor: "#00BFFF" }]}>
                      <Text style={styles.tagLabel}>Cost</Text>
                      <Text style={styles.tagValue}>{item.cost}</Text>
                    </View>
                    <View style={[styles.tag, {
                      backgroundColor:
                        item.stock === 0
                          ? "#FF6347"
                          : item.stock < 10
                            ? "#FFD700"
                            : "#00BFFF",
                      justifyContent: 'center'
                    }]}>
                      {item.quantityRemaining && <Text style={styles.tagLabel}>Stock in Hand</Text>}
                      <Text style={styles.tagValue}>{item.stock <= 0 ? 'Out of Stock' : item.quantityRemaining}</Text>
                    </View>
                  </View>

                  {/* Action Icons */}
                  {userInfo?.isAdmin && <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => handleAddStockButton(item._id)}>
                      <Ionicons name="add-circle" size={28} color="green" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSellStockButton(item._id)}>
                      <Ionicons name="remove-circle" size={28} color="orange" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteProductButton(item._id)}>
                      <Ionicons name="trash" size={28} color="red" style={styles.icon} />
                    </TouchableOpacity>
                  </View>}
                </View>
              )}
            />
          ) : (
            <View className='w-full p-2 flex-1'>
              <Image source={require('../assets/images/nodata.png')} className='w-full h-[300]' />
              <Text className='text-[18px] text-center font-bold text-[#333] mt-10'>No item added yet!</Text>
              <Text className='text-[14px] font-semibold text-[#666] text-center'>Start adding item to manage the stock better.</Text>
            </View>
          )
          )}


      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddProductModalVisible}
        onRequestClose={closeAddProductModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add New Product</Text>
            <Ionicons
              name="close-circle"
              size={25}
              color="#FF362E"
              onPress={closeAddProductModal}
              style={styles.closeIcon}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Product name <Text style={{ color: '#FF362E' }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter product name"
                style={styles.modalInputBox}
                value={productName}
                onFocus={() => setProductNameTouched(true)}
                onBlur={() => {
                  if (productName === '') setProductNameError(true);
                }}
                onChangeText={(name) => {
                  setProductName(name);
                  if (name !== '') setProductNameError(false);
                }}
              />
              {productNameError && productNameTouched && (
                <Text style={styles.errorText}>Product name is required</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Product Quantity <Text style={{ color: '#FF362E' }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter number of item like 10, 20, 100"
                keyboardType="number-pad"
                style={styles.modalInputBox}
                value={productQuantity ? String(productQuantity) : ''}
                onFocus={() => setProductQuantityTouched(true)}
                onBlur={() => {
                  if (!productQuantity || productQuantity === 0) setProductQuantityError(true);
                }}
                onChangeText={(number) => {
                  const parsedNumber = parseInt(number, 10);
                  setProductQuantity(isNaN(parsedNumber) ? '' : parsedNumber);
                  if (number !== '') setProductQuantityError(false);
                }}
              />

              {productQuantityError && productQuantityTouched && (
                <Text style={styles.errorText}>Product quantity is required </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Product Price <Text style={{ color: '#FF362E' }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter price"
                keyboardType="number-pad"
                style={styles.modalInputBox}
                value={price}
                onFocus={() => setPriceTouched(true)}
                onBlur={() => {
                  if (price === '') setPriceError(true);
                }}
                onChangeText={(price) => {
                  setPrice(price);
                  if (price !== '') setPriceError(false);
                }}
              />
              {priceError && priceTouched && (
                <Text style={styles.errorText}> Price required </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                disabled={productName === '' || price === '' || productQuantity === 0}
                onPress={handleAddProducts}
                style={[styles.button, { height: 50 },
                productName === '' || price === '' || productQuantity === 0
                  ? styles.buttonDisabled
                  : styles.buttonEnabled
                ]}>
                <Text
                  style={styles.buttonText}>
                  Add Product
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isAddStockModalVisible}
        onRequestClose={closeAddStockModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Stock</Text>
            <Ionicons
              name="close-circle"
              size={25}
              color="#FF362E"
              onPress={closeAddStockModal}
              style={styles.closeIcon}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Quantity <Text style={{ color: '#FF362E' }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter number of item like 10, 20, 100"
                keyboardType="number-pad"
                style={styles.modalInputBox}
                value={addStockQuantity}
                onFocus={() => setAddStockQuantityTouched(true)}
                onBlur={() => {
                  if (addStockQuantity === '') setAddStockQuantityError(true);
                }}
                onChangeText={(number) => {
                  setAddStockQuantity(number);
                  if (number !== '') setAddStockQuantityError(false);
                }}
              />
              {addStockQuantityError && addStockQuantityTouched && (
                <Text style={styles.errorText}>Stock quantity is required </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                disabled={addStockQuantity === ''}
                onPress={handleAddStock}
                style={[styles.button, { height: 50 },
                addStockQuantity === ''
                  ? styles.buttonDisabled
                  : styles.buttonEnabled
                ]}>
                <Text
                  style={styles.buttonText}>
                  Add Stock
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isSellStockModalVisible}
        onRequestClose={closeSellStockModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sell Stock</Text>
            <Ionicons
              name="close-circle"
              size={25}
              color="#FF362E"
              onPress={closeSellStockModal}
              style={styles.closeIcon}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Quantity <Text style={{ color: '#FF362E' }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter number of item like 10, 20, 100"
                keyboardType="number-pad"
                style={styles.modalInputBox}
                value={sellStockQuantity}
                onFocus={() => setSellStockQuantityTouched(true)}
                onBlur={() => {
                  if (sellStockQuantity === '') setSellStockQuantityError(true);
                }}
                onChangeText={(number) => {
                  setSellStockQuantity(number);
                  if (number !== '') setSellStockQuantityError(false);
                }}
              />
              {sellStockQuantityError && sellStockQuantityTouched && (
                <Text style={styles.errorText}>Stock quantity is required </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                disabled={sellStockQuantity === ''}
                onPress={handleSellProduct}
                style={[styles.button, { height: 50 },
                sellStockQuantity === ''
                  ? styles.buttonDisabled
                  : styles.buttonEnabled
                ]}>
                <Text
                  style={styles.buttonText}>
                  Sell stock
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteProductModalVisible}
        onRequestClose={() => setIsDeleteProductModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalView}>
            <Text style={[styles.modalHeaderText, { color: '#FF3031' }]}>Log out</Text>
            <Text style={styles.modalLabel}>Are you sure you want to logout?</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDeleteConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsDeleteProductModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ToastifyModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        message={message}
        isSuccessful={isSuccessful}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 8,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
    marginBottom: 45,
  },
  header: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
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
    marginVertical: 10
  },
  optionText: {
    fontSize: 17,
    fontWeight: '500'
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  tag: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
    minWidth: 100,
  },
  tagLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  tagValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 10,
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
  },
  modalText: {
    marginTop: 10,
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
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3031',
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
  modalInputBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    height: 40,
    backgroundColor: '#F7F7F7',
  },
  button: {
    width: '100%',
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#28a745',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  errorText: {
    color: '#FF362E',
    fontSize: 12,
    marginTop: 5,
  },
});

export default Products;
