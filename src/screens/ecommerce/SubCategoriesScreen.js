import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    BackHandler,
    Pressable,
    Linking
} from 'react-native';
import { mainView } from '../../Assets/styles';
import { Bar } from '../../components/StatusBar';
import { heightToDp, widthToDp } from '../../Assets/helpers/Responsive';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Icon10 from 'react-native-vector-icons/dist/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsBySubCategory, getProductSubCategories } from '../../Redux/ecommerceSlice';

const EcommerceSubCategories = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const { profile_pic, full_name, userid } = useSelector(state => state.user.userdata);
    const { subCategories, products } = useSelector(state => state.ecommerce)
    const category_id = route.params?.category_id ? route.params.category_id : 0
    const backAction = () => {
        const popAction = StackActions.pop(1);
        navigation.dispatch(popAction);
        return true;
    };

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);

    useEffect(() => {
        dispatch(getProductSubCategories(category_id))
            .unwrap()
            .then(res => {
                dispatch(getProductsBySubCategory(res.data[0].sub_category_id));
            }
            )
    }, [])

    const getSubcategoryProducts = (id) => {
        dispatch(getProductsBySubCategory(id))
    }


    const renderSubCategories = ({ item }) => {
        return (
            <TouchableOpacity style={
                {
                    marginBottom: widthToDp('2.5'),
                    alignItems: 'center',
                    width: "33%"
                }
            }
                activeOpacity={0.8}
                onPress={() => getSubcategoryProducts(item.sub_category_id)}
            >
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        resizeMode: 'contain',
                    }}
                    source={{ uri: item.image }}
                />
                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'Poppins-Regular',
                        fontSize: heightToDp('1.3'),
                        marginTop: heightToDp('1'),
                    }}
                >
                    {item.sub_category_name}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderProducts = ({ item }) => {
        return (
            <Pressable
                style={{
                    width: widthToDp('28'),
                    height: heightToDp('22'),
                    backgroundColor: '#525252',
                    borderRadius: 15,
                    borderColor: 'white',
                    borderWidth: 1,
                    marginRight: widthToDp('4'),
                    marginBottom: heightToDp('2')
                }}
                onPress={() => navigation.navigate('WebView',{url: item.link})}
            >
                <Image
                    style={{
                        width: widthToDp('28'),
                        height: heightToDp('16'),
                        resizeMode: 'contain',
                        borderRadius: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                        alignSelf: 'center',
                        marginTop: heightToDp('-0.1'),
                    }}
                    source={{
                        uri: item.image,
                    }}
                />
                <View
                    style={{
                        backgroundColor: '#FF5F6D',
                        width: widthToDp('12'),
                        paddingVertical: heightToDp('0.2'),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderTopRightRadius: 15,
                        borderBottomRightRadius: 15,
                        borderTopLeftRadius: 15,
                        position: 'absolute',
                        top: -1,
                        left: -1,
                    }}>
                    <Text
                        style={{
                            color: 'white',
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: heightToDp('1.5'),
                        }}>
                        -30%
                    </Text>
                </View>
                <View
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: 'white',
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        bottom: heightToDp('6'),
                        right: widthToDp('1'),
                        elevation: 4,
                    }}>
                    <Icon name="plus" size={heightToDp('2.4')} color="black" />
                </View>

                <Text
                    style={{
                        color: 'white',
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: heightToDp('1.4'),
                        marginHorizontal: widthToDp('2'),
                        marginTop: heightToDp('1'),
                    }} numberOfLines={2}ellipsizeMode={'tail'}>
                    {item.product_name}
                </Text>
            </Pressable>
        );
    };


    return (
        <SafeAreaView style={[mainView]}>
            <Bar barStyle="light-content" />
            <ScrollView>
                <View style={
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: widthToDp('5'),
                        marginVertical: heightToDp('1.4'),
                    }
                }>
                    <Icon10
                        name="keyboard-backspace"
                        size={25}
                        color="white"
                        onPress={backAction}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginLeft: widthToDp('3') }}>
                            <Text
                                style={{
                                    color: 'gray',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: heightToDp('1.3'),
                                }}>
                                welcome
                            </Text>
                            <Text
                                style={{
                                    color: 'white',
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: heightToDp('1.7'),
                                }}>
                                {full_name}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={{
                                width: 40,
                                height: 40,
                                borderColor: '#FF5F6D',
                                borderWidth: widthToDp('0.4'),
                                borderRadius: 10,
                                marginLeft: widthToDp('2'),
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                            }}
                            onPress={() => navigation.push("Profile", { user_id: userid })}
                        >
                            <Image
                                style={{
                                    width: widthToDp('8.5'),
                                    height: heightToDp('4'),
                                    resizeMode: 'cover',
                                    borderRadius: 6,
                                }}
                                source={{
                                    uri: profile_pic
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: widthToDp('5'),
                        marginTop: heightToDp('2'),
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'Poppins-Bold',
                                fontSize: heightToDp('2'),
                                marginRight: widthToDp('2'),
                            }}>
                            Sub Categories
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        marginTop: heightToDp('1'),
                        marginBottom: heightToDp('1.5'),
                        marginHorizontal: widthToDp('1'),
                    }}>
                    <FlatList
                        data={subCategories}
                        renderItem={renderSubCategories}
                        keyExtractore={item => item.sub_category_id}
                        numColumns={3}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginHorizontal: widthToDp('5'),
                        marginTop: heightToDp('2'),
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                color: 'white',
                                fontFamily: 'Poppins-Bold',
                                fontSize: heightToDp('1.8'),
                                marginRight: widthToDp('2'),
                            }}>
                            Products
                        </Text>
                    </View>
                    {/* <Text
                    style={{
                        color: '#FF5F6D',
                        fontFamily: 'Poppins-Regular',
                        fontSize: heightToDp('1.5'),
                    }}>
                    View All
                </Text> */}
                </View>
                <View style={{ marginTop: heightToDp('1.3') }}>
                    <FlatList
                        data={products}
                        renderItem={renderProducts}
                        keyExtractore={item => item.product_id}
                        style={{ paddingLeft: widthToDp('5') }}
                        numColumns={3}
                        ListEmptyComponent={() => <Text style={{ color: 'gray', textAlign: 'center' }}>No products in this sub category</Text>}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EcommerceSubCategories;
