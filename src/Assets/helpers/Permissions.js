/* eslint-disable prettier/prettier */
import { Alert, Linking } from 'react-native';

import {
    RESULTS,
    requestMultiple,
    request,
    PERMISSIONS,
} from 'react-native-permissions';

// It requests for mulitple permissions and then checks status of each.

export const checkMultiplePermissions = async (permissions) => {
    let isPermissionGranted = false;
    await requestMultiple(permissions).then(statuses => {
        for (var index in permissions) {
            if (statuses[permissions[index]] === RESULTS.GRANTED) {
                isPermissionGranted = true;
            } else {
                isPermissionGranted = false;
                break;
            }
        }
    });
    return isPermissionGranted;
};

// In case you want to check a single permission

export const checkPermission = async (permission) => {
    var isPermissionGranted = false;
    await request(permission).then((result) => {
        switch (result) {
            case RESULTS.GRANTED:
                isPermissionGranted = true;
                break;
            case RESULTS.DENIED:
                isPermissionGranted = false;
                break;
            case RESULTS.BLOCKED:
                isPermissionGranted = false;
                break;
            case RESULTS.UNAVAILABLE:
                isPermissionGranted = false;
                break;
        }
    }
    );
    return isPermissionGranted;
};

// Permission Alert

export const permissionAlert = (alertMessage, navigation, cancelable = false) => {
    const shouldStackPop = () => navigation ? navigation.pop() : null;
    return Alert.alert(
        'Permission Request',
        alertMessage,
        [
            {
                text: 'Go to Settings',
                onPress: () => {
                    shouldStackPop();
                    Linking.openSettings();
                },
            },
            {
                text: 'Cancel',
                onPress: !cancelable && shouldStackPop(),
                style: 'cancel',
            },
        ],
        { cancelable: false },
    );
}


export { PERMISSIONS };

