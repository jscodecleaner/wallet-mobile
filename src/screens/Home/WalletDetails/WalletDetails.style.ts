import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex:1,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20
  },
  fontBold: {
    fontWeight: 'bold'
  },
  scrollViewStyle: {
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: 'red',
  },
  TransactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 20,
    paddingBottom: 10,
    color: '#0568fe'
  },
  TransactionTitleBold: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0568fe'
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    height: 550
  },
  modalScroll: {
    width: '100%',
    backgroundColor: 'rgb(200,200,200, 0.7)',
    marginBottom: 10
  },
  modalTitle: {
    textAlign: 'center',
    color: '#0568fe',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  modalGroup: {
    borderBottomWidth: 1,
    borderColor: '#D3D3D3',
    paddingVertical: 15
  },
  modalGroupName: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 5,
  },
  modalText: {
    color: '#0568fe',
  },
  modalValue: {
    color: '#696969'
  },
  modalButtonContainer: {
    paddingHorizontal: 80,
  },
})
