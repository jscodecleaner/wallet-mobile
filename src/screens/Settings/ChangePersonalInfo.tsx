import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText, withTheme, RadioButton } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import SelectDropdown from 'react-native-select-dropdown';
import countryList from 'react-select-country-list'
import CountryFlag from "react-native-country-flag";
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import { Toast } from 'react-native-popup-confirm-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';

import CustomButton from '../../components/CustomButton/CustomButton';
import { BASE_URL, getProxyUrl } from '../../services/common';
import { UserProfileInterface } from '../../types/interface'
import { ApiEndpoint, StatusCode } from '../../types/enum';
import { useStyles } from './Settings.style'
import { ScrollView } from 'react-native-gesture-handler';
import { universalPostRequestWithData, universalGetRequestWithParams } from '../../services/RequestHandler';
import { validateAge } from '../../services/validators';
import Error from '../../components/error';

const ChangePersonalInfo = ({ theme, navigation }) => {

  const styles = useStyles(theme)

  // variables of components
  const [pageUserProfile, setPageUserProfile] = useState({} as UserProfileInterface)
  const [progress, setProgress] = useState(true);
  const [error, setError] = useState('');
  // const [showDatePicker, setShowDatePicker] = useState(false);

  const listOfCountry = useMemo(() => countryList().getLabels(), []);

  useEffect(() => {
    const getUserProfile = async () => {
      const url = `${BASE_URL}/${ApiEndpoint.GET_USER_PROFILE}`

      const response: any = await universalGetRequestWithParams(url)

      if (response.status === StatusCode.OKAY) {
          const userProfile = response.data.data
          setPageUserProfile(userProfile)
      } else {
        // Toast.show({
        //   title: 'Change personal info',
        //   text: response.data.message,
        //   color: theme.colors.notification,
        //   timeColor: theme.colors.primary,
        //   timing: 3000,
        //   icon: <MaterialCommunityIcons name='check' color={theme.colors.background} size={30}/>,
        //   position: 'top',
        // })
      }

      // 'll add toast code here

      setProgress(false)
    }

    getUserProfile()
  }, [])

  const isValidPhone = () => {
    const isValid = pageUserProfile.phone_number && !isValidPhoneNumber(pageUserProfile.phone_number)
    if (typeof(isValid) === 'boolean')
      return isValid
  }
  const isValidHomePhone = () => {
    const isValid = pageUserProfile.home_phone && !isValidPhoneNumber(pageUserProfile.home_phone)
    if (typeof(isValid) === 'boolean')
      return isValid
  }
  const isValidWorkPhone = () => {
    const isValid = pageUserProfile.work_phone && !isValidPhoneNumber(pageUserProfile.work_phone)
    if (typeof(isValid) === 'boolean')
      return isValid
  }

  const validateForm = () => (
    pageUserProfile.first_name &&
    pageUserProfile.last_name &&
    pageUserProfile.address_1 &&
    pageUserProfile.country &&
    pageUserProfile.state &&
    pageUserProfile.city &&
    pageUserProfile.zip_code &&
    (!isValidPhone()) ? '' : 'disabled'
  )

  const handleSubmit = async () => {
    if (progress === true) {
      return;
    }
    setProgress(true);

    const url = `${BASE_URL}/${ApiEndpoint.UPDATE_USER_PROFILE}`
    const payload = pageUserProfile
    const response: any = await universalPostRequestWithData(url, payload);

    if (response && response.status === StatusCode.OKAY) {
      Toast.show({
        title: 'Change personal info',
        text: response.data.message,
        color: theme.colors.error,
        timeColor: theme.colors.primary,
        timing: 3000,
        icon: <MaterialCommunityIcons name='check' color={theme.colors.background} size={30}/>,
        position: 'bottom',
      })
    } else {
      setError(response.data.message);
    }

    setProgress(false)
  }

  const setGender = (value) => (
    setPageUserProfile({
      ...pageUserProfile,
      gender: value,
    })
  )

  return (
    <SafeAreaView style={styles.container}>
      {
        progress?(
          <Spinner
          visible={progress}
          textContent={'Loading...'}
          textStyle={{
            color: '#FFF',
          }}
        />
        ):(
        <ScrollView style={{ width: '100%', paddingHorizontal: 15 }}>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="First name *"
              value={pageUserProfile.first_name}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  first_name: value,
                })
              }
            autoFocus
            />
            {!pageUserProfile.first_name && <Text style={{ color: 'red' }}>First name is required</Text>}
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="Middle name"
              value={pageUserProfile.middle_name}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  middle_name: value,
                })
              }
            />
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="Last name *"
              value={pageUserProfile.last_name}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  last_name: value,
                })
              }
            />
            {!pageUserProfile.last_name && <Text style={{ color: 'red' }}>Last name is required</Text>}
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={[styles.input, styles.bottomLine]}
              label="Email"
              value={pageUserProfile.email}
              disabled={true}
            />
          </View>
          <View style={[styles.genderWrapper]}>
            <Text style={{ color: 'gray' }}>Select Gender</Text>
            <View style={styles.radioWrapper}>
              <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Male')}>
                <RadioButton
                  value="Male"
                  color='black'
                  status={pageUserProfile.gender === 'Male' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('Male')}
                />
                <Text>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Female')}>
                <RadioButton
                  value="Female"
                  color='black'
                  status={pageUserProfile.gender === 'Female' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('Female')}
                />
                <Text>Female</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Unknown')}>
                <RadioButton
                  value="Unknown"
                  color='black'
                  status={pageUserProfile.gender === 'Unknown' ? 'checked' : 'unchecked'}
                  onPress={() => setGender('Unknown')}
                />
                <Text>Unknown</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="Occupation"
              value={pageUserProfile.occupation}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  occupation: value,
                })
              }
            />
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="Address 1 *"
              value={pageUserProfile.address_1}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  address_1: value,
                })
              }
            />
            {!pageUserProfile.address_1 && <Text style={{ color: 'red' }}>Address 1 is required</Text>}
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="Address 2"
              value={pageUserProfile.address_2}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  address_2: value,
                })
              }
            />
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="City *"
              value={pageUserProfile.city}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  city: value,
                })
              }
            />
            {!pageUserProfile.city && <Text style={{ color: 'red' }}>City is required</Text>}
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="State/County *"
              value={pageUserProfile.state}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  state: value,
                })
              }
            />
            {!pageUserProfile.country && <Text style={{ color: 'red' }}>State/Country is required</Text>}
          </View>
          <View style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              label="Postal code/Zipcode *"
              value={pageUserProfile.zip_code}
              onChangeText={(value) =>
                setPageUserProfile({
                  ...pageUserProfile,
                  zip_code: value,
                })
              }
            />
            {!pageUserProfile.zip_code && <Text style={{ color: 'red' }}>Postal code/Zipcode is required</Text>}
          </View>
          <View style={{ width: '100%' }}>
            <SelectDropdown
              data={listOfCountry}
              onSelect={(selectedItem, index) => {
                setPageUserProfile({
                  ...pageUserProfile,
                  country: selectedItem,
                })
              }}
              buttonStyle={styles.countryDropdownBtnStyle}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.countryDropdownBtnChildStyle}>
                    <Text style={styles.countryDropdownBtnTxt}>{selectedItem ? selectedItem : 'Country'}</Text>
                    <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
                  </View>
                )
              }}
              defaultValue={pageUserProfile.country}
              dropdownOverlayColor="transparent"
              dropdownStyle={styles.countryDropdownDropdownStyle}
              rowStyle={styles.countryDropdownRowStyle}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <View style={styles.countryDropdownRowChildStyle}>
                    <CountryFlag isoCode={countryList().getValue(item)} size={25} />
                    <Text style={styles.countryDropdownRowTxt}>{item}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View style={{ width: '100%', marginTop: 20 }}>
            <TextInput
              style={styles.input}
              label="Mobile phone number *"
              value={pageUserProfile.phone_number ? pageUserProfile.phone_number : "+1"}
              onChangeText={(value) =>
                value?
                setPageUserProfile({
                  ...pageUserProfile,
                  phone_number: value,
                }):
                setPageUserProfile({
                  ...pageUserProfile,
                  phone_number: "+",
                })
              }
              disabled
            />
            {isValidPhone() && <Text style={{ color: 'red' }}>Invalid phone number</Text>}
          </View>
          <View style={{ width: '100%', marginTop: 20 }}>
            <TextInput
              style={styles.input}
              label="Home phone number"
              value={pageUserProfile.home_phone?pageUserProfile.home_phone:"+1"}
              onChangeText={(value) =>
                value?
                setPageUserProfile({
                  ...pageUserProfile,
                  home_phone: value,
                }):
                setPageUserProfile({
                  ...pageUserProfile,
                  home_phone: "+",
                })
              }
            />
            {isValidHomePhone() && <Text style={{ color: 'red' }}>Invalid Home phone number</Text>}
          </View>
          <View style={{ width: '100%', marginTop: 20 }}>
            <TextInput
              style={styles.input}
              label="Work phone number"
              value={pageUserProfile.work_phone?pageUserProfile.work_phone:"+1"}
              onChangeText={(value) =>
                value?
                setPageUserProfile({
                  ...pageUserProfile,
                  work_phone: value,
                }):
                setPageUserProfile({
                  ...pageUserProfile,
                  work_phone: "+",
                })
              }
            />
            {isValidWorkPhone() && <Text style={{ color: 'red' }}>Invalid Work phone number</Text>}
          </View>

          <View style={{ width: '100%' }}>
            <TextInput
              style={[styles.input]}
              label="DOB"
              value={pageUserProfile.birthdate}
              disabled={true}
            />
          </View>
          
          <Error error={error} />
          <View style={{width: '100%', marginTop: 30}}>
            <CustomButton theme={theme} name="Save" onClick={handleSubmit} state={validateForm()} />
          </View>
        </ScrollView>
      )
    }

    </SafeAreaView>
  );
}
export default withTheme(ChangePersonalInfo);
