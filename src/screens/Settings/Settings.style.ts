import { StyleSheet } from 'react-native';

export const useStyles = theme => (StyleSheet.create({
  container: {
    width: '100%',
  },
  transactionContainer: {
    padding: 20
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  leftText: {
    width: '40%',
    fontSize: 18,
    marginRight: 10
  },
  rightText: {
    width: '60%',
    fontSize: 18,
  },
  actionsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  input: {
    marginVertical: 10,
    height: 50,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: theme.colors.text,
  },
  countryDropdownBtnStyle: {
    width: '100%',
    height: 50,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderColor: theme.colors.text,
  },
  countryDropdownBtnChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 18,
  },
  countryDropdownBtnTxt: {
    color: theme.colors.text,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 12,
  },
  countryDropdownDropdownStyle: { backgroundColor: '#fff' },
  countryDropdownRowStyle: {
    backgroundColor: '#fff',
    borderBottomColor: theme.colors.text,
    height: 50,
  },
  countryDropdownRowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  countryDropdownRowTxt: {
    color: theme.colors.text,
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 12,
  },
}));
