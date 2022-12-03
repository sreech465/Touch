
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';

const CheckBox = ({ labelName, fieldName, options, onPress, value }) => {
    const renderOptions = ({ item }) => {
        let isSelected = item.name === value;
        return (<TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => onPress(fieldName, item.name)}>
            <View
                style={StyleSheet.flatten([styles.checkBox, { backgroundColor: isSelected ? '#FF5F6D' : '#3F3C3D', }])}>
                <Text
                    style={styles.optionText}>
                    {item.name.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>)
    }
    return (
        <View style={styles.container}>
            <View>
                <Text
                    style={styles.label}>
                    {labelName}
                </Text>
            </View>
            <FlatList
                data={options}
                renderItem={renderOptions}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.flatListContainer}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginBottom: heightToDp('2')
    },
    flatListContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: 'gray',
        marginBottom: heightToDp('0.5'),
        fontWeight: 'bold'
    },
    checkBox: {
        paddingHorizontal: widthToDp('7'),
        height: heightToDp('5'),
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: widthToDp('3.6'),
        color: 'white',
        fontWeight: 'bold'
    }
})

export default React.memo(CheckBox);