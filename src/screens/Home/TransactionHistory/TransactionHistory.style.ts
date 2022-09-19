import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex:1
  },
  fontBold: {
    fontWeight: 'bold'
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: 'rgb(200,200,200, 0.7)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgb(200,200,200)',
  },
  list: {
    backgroundColor: 'rgb(210, 224, 249)',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgrey',
    padding: 10,
    marginVertical: 10,
    flexDirection: 'row'
  },
  viewText: {
    fontSize: 20,
    color: '#0568fe'
  },
  listContent: {
    flex: 1
  },
  iconContent: {
    backgroundColor: '#f00',
    width: 70,
    height: 100,
    paddingTop: 20
  },
  listIcon: {
    paddingTop: 30,
    paddingRight: 10
  }
})
