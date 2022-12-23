import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SQLite from 'react-native-sqlite-storage';
import {SwipeListView} from 'react-native-swipe-list-view';

const db = SQLite.openDatabase(
  {
    name: 'UsersDB',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);
export default function UserListScreen({navigation}) {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  const getData = async () => {
    const value = await AsyncStorage.getItem('userData');
    if (value != null) {
      var dataObj = JSON.parse(value);
      console.log('Fetching data ==>' + dataObj.userId);
      await db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Users WHERE id !=?',
          [dataObj.userId],
          (tx, results) => {
            if (results.rows.length > 0) {
              var userList = [];
              for (var i = 0; i < results.rows.length; i++) {
                userList.push(results.rows.item(i));
              }
              console.log(userList);
              setData(userList);
            } else {
              console.log('No users found');
              setData([]);
            }
          },
        );
      });
    }
  };

  const removeUser = async userId => {
    console.log('delete==>' + userId);
    await db.transaction(async tx => {
      await tx.executeSql(
        'DELETE FROM Users WHERE id = ?',
        [userId],
        (txObj, results) => {
          console.log('deleteQuery==>' + JSON.stringify(results));
          if (results.rowsAffected === 1) {
            getData();
          }
        },
      );
      /* await getData(); */
    });
  };

  const renderItem = dataItem => {
    return (
      <View style={styles.itemView}>
        <Text style={styles.itemText}>
          {dataItem.item.name} : {dataItem.item.mobile}
        </Text>
      </View>
    );
  };

  const renderHiddenItem = dataItem => (
    <View style={styles.rowBack}>
      <Text></Text>
      {/* <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => console.log('Close')}>
        <Text style={styles.backTextWhite}>Close</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => removeUser(dataItem.item.id)}>
        <Text style={styles.backTextWhite}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  return (
    <View style={styles.body}>
      <SwipeListView
        data={data}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={0}
        rightOpenValue={-75}
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={onRowDidOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  listStyle: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  itemView: {
    flex: 1,
    backgroundColor: '#808',
    borderColor: '#808080',
    borderWidth: 1,
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'stretch',
    margin: 10,
    flexDirection: 'column',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginEnd: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});
