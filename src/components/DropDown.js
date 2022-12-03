import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon3 from 'react-native-vector-icons/dist/Feather';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';

const DropDown = ({ labeName, fieldName, options, handleFormChange, value, disabled = false, renderRightComponent: RenderRightComponent }) => {

    return (
        <>
            <Text style={styles.label}>{labeName}</Text>
            <ModalDropdown
                isFullWidth
                options={options}
                dropdownStyle={styles.dropdownStyle}
                dropdownTextStyle={styles.dropdownTextStyle}
                dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
                onSelect={(_, option) => handleFormChange(fieldName, option)}
                disabled={disabled}
            >
                <View
                    style={styles.container}>
                    <View style={styles.labelButton}
                    >
                        <Text style={styles.selectedOptionText}>{value}</Text>
                        {RenderRightComponent ? <RenderRightComponent /> : <Icon3
                            name="chevron-down"
                            size={heightToDp('3')}
                            color="#FF5F6D"
                        />}
                    </View >
                </View>
            </ModalDropdown>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: heightToDp('2'),
    },
    label: {
        color: 'gray',
        marginBottom: heightToDp('0.5'),
        fontWeight: 'bold'
    },
    labelButton: {
        backgroundColor: '#3F3C3D',
        borderRadius: 8,
        paddingHorizontal: widthToDp('2'),
        borderWidth: 0.15,
        borderBottomWidth: 1,
        borderColor: '#FF5F6D',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: heightToDp('6.5'),
    },
    selectedOptionText: {
        color: 'white',
        fontWeight: 'bold'
    },
    dropdownStyle: {
        backgroundColor: 'gray',
        borderRadius: 12,
        borderWidth: widthToDp(0.5),
        borderColor: '#FF5F6D',
        paddingVertical: heightToDp('1'),
        marginTop: -42
    },
    dropdownTextStyle: {
        backgroundColor: 'transparent',
        color: 'white',
        fontWeight: 'bold',
        fontSize: heightToDp('1.8')
    },
    dropdownTextHighlightStyle: {
        color: 'white',
        backgroundColor: '#FF5F6D',
    }
})
export default React.memo(DropDown);