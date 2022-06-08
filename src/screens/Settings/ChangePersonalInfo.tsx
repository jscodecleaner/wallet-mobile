import React, { useState, useMemo } from 'react';
import { View, Image, StatusBar, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, HelperText, withTheme, RadioButton } from 'react-native-paper';
import countryList from 'react-select-country-list'
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import CountryFlag from "react-native-country-flag";

import { useStyles } from './Settings.style'

const ChangePersonalInfo = ({ theme, navigation }) => {

  const styles = useStyles(theme)

  const [checked, setChecked] = useState('male')

  const listOfCountry = useMemo(() => countryList().getData(), []);
  const [recipientCountry, setRecipientCountry] = useState('');

  return (
    <View>
      <View>

        <View style={styles.row} onTouchStart={() => setChecked('male')}>
          <RadioButton
            value="Male"
            color='black'
            status={checked === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('male')}
          />
          <Text style={{ padding: 7 }}>Male</Text>
        </View>
        <View style={styles.row} onTouchStart={() => setChecked('female')}>
          <RadioButton
            value="Female"
            color='black'
            status={checked === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('female')}
          />
          <Text style={{ padding: 7 }}>Female</Text>
        </View>
        <View style={styles.row} onTouchStart={() => setChecked('unknown')}>
          <RadioButton
            value="Unknown"
            color='black'
            status={checked === 'unknown' ? 'checked' : 'unchecked'}
          />
          <Text style={{ padding: 7 }}>Unknown</Text>
        </View>

      </View>

      <View>
        {/* <TextInput autoComplete="birthdate-full"></TextInput> */}
      </View>

      <View>
        <SelectDropdown
          data={listOfCountry}
          onSelect={(selectedItem, index) => {
            setRecipientCountry(selectedItem.value)
          }}
          buttonStyle={styles.countryDropdownBtnStyle}
          renderCustomizedButtonChild={(selectedItem, index) => {
            return (
              <View style={styles.countryDropdownBtnChildStyle}>
                <Text style={styles.countryDropdownBtnTxt}>{selectedItem ? selectedItem.label : 'Country'}</Text>
                <FontAwesomeIcons name="chevron-down" color={theme.colors.text} size={14} />
              </View>
            )
          }}
          dropdownOverlayColor="transparent"
          dropdownStyle={styles.countryDropdownDropdownStyle}
          rowStyle={styles.countryDropdownRowStyle}
          renderCustomizedRowChild={(item, index) => {
            return (
              <View style={styles.countryDropdownRowChildStyle}>
                <CountryFlag isoCode={item.value} size={25} />
                <Text style={styles.countryDropdownRowTxt}>{item.label}</Text>
              </View>
            );
          }}
        />
      </View>

    </View>
  );
};

export default withTheme(ChangePersonalInfo);
