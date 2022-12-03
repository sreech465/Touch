import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from "react-native-modal";
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';

const AnimatedModal = ({ children, customHeader: CustomHeader, headerText, isVisible, hideModal, swipeThreshold = 150 }) => {
    return (
        <View>
            <Modal
                isVisible={isVisible}
                swipeDirection="down"
                onBackButtonPress={() => hideModal()}
                onSwipeComplete={() => hideModal()}
                onBackdropPress={() => hideModal()}
                swipeThreshold={swipeThreshold}
                animationIn="slideInUp"
                animationOut='slideOutDown'
                animationOutTiming={1000}
                style={styles.modal}
                useNativeDriverForBackdrop
                propagateSwipe
                avoidKeyboard
            >
                <View style={styles.container}>
                    <View style={styles.bar}>
                    </View>
                    {CustomHeader ? <CustomHeader /> : <Text style={styles.headerText}>{headerText}</Text>}
                    <View style={styles.horizontalBorder} />
                    <View style={styles.childContainer}>{children}</View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        marginHorizontal: 0,
        marginBottom: 0,
        marginTop: 'auto',
        justifyContent: 'flex-end'
    },
    container: {
        backgroundColor: '#181818',
        borderTopLeftRadius: widthToDp('8'),
        borderTopRightRadius: widthToDp('8'),
        maxHeight: "90%",
    },
    bar: {
        width: widthToDp('12'),
        height: heightToDp('0.5'),
        backgroundColor: "gray",
        alignSelf: "center",
        borderRadius: 4,
        marginTop: heightToDp('0.8'),
        marginBottom: heightToDp('1')
    },
    headerText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: widthToDp('5'),
        marginBottom: heightToDp('1')
    },
    horizontalBorder: {
        width: '100%',
        height: heightToDp('0.09'),
        opacity: 0.1,
        backgroundColor: "gray",
        marginBottom: heightToDp('1')
    },
    childContainer: {
        padding: widthToDp('5'),
        paddingTop: 0,
    }
})

export default React.memo(AnimatedModal);