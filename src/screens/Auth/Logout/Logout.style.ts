import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 20,
    },
    fontBold: {
      fontWeight: 'bold'
    },
    subTitleArea: {
      marginVertical: 30,
      alignItems: 'center'
    },
    subTitle: {
      fontSize: 20,
      marginBottom: 10
    },
    buttonArea: {
      width: '100%',
      marginTop: windowHeight / 4,
      paddingHorizontal: 50,
      paddingVertical: 20,
    }
});
