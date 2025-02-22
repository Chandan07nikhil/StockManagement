import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { Authcontext } from '../context/AuthProvider'
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Account() {
  const navigation = useNavigation<any>();

  const { logout } = useContext<any>(Authcontext);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState<boolean>(false);

  const handleConfirm = () => {
    logout();
  }

  return (
    <View className='flex-1 p-5 justify-between'>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} className='flex-row justify-between border-b-gray-500 border-b-2 bg-white px-4 py-5'>
          <Text className='text-[14px] font-semibold text-black '>Profile</Text>
          <MaterialIcons name='arrow-forward-ios' size={16} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Privacy')} className='flex-row justify-between  border-b-gray-500 border-b-2  bg-white px-4 py-5'>
          <Text className='text-[14px] font-semibold text-black '>Privacy Policy</Text>
          <MaterialIcons name='arrow-forward-ios' size={16} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Terms')} className='flex-row justify-between  border-b-gray-500 border-b-2  bg-white px-4 py-5'>
          <Text className='text-[14px] font-semibold text-black '>Terms of use</Text>
          <MaterialIcons name='arrow-forward-ios' size={16} color={'black'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setIsLogoutModalVisible(true)} className='flex-row mb-[57] gap-2 items-center justify-center bg-red-500 py-5'>
        <Text className='text-[16px] font-bold text-white '>Log out</Text>
        <MaterialIcons name='logout' size={18} color={'white'} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogoutModalVisible}
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalView}>
            <Text style={[styles.modalHeaderText, { color: '#FF3031' }]}>Log out</Text>
            <Text style={styles.modalLabel}>Are you sure you want to logout?</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsLogoutModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
})