import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tab, TabView } from 'react-native-elements';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';


const Tabs = {
    experts: "Posts",
    courses: "Videos",
    // careerPortal: "Groups"
}

const TabsView = ({ children }) => {

    const [index, setIndex] = React.useState(0);

    const tabs = [
        { tabTndex: 0, title: Tabs.experts },
        { tabTndex: 1, title: Tabs.courses },
        // { tabTndex: 2, title: Tabs.careerPortal }
    ];

    // if (React.Children.count(children) !== tabs.length) {
    //     throw `child views must equals to tabs ${tabs.length}`;
    // }

    const renderTab = ({ tabTndex, title }) => {
        return (
            <Tab.Item
                containerStyle={styles.container}
                title={title}
                titleStyle={[
                    styles.title,
                    { fontFamily: index === tabTndex ? "Poppins-SemiBold" : "Poppins-Regular" , color: index === tabTndex ? '#FF5F6D':'#636363'}
                ]}
                buttonStyle={styles.buttonStyle}
                type={"clear"}
                raised={false}
                iconRight={false}
            />
        )
    }

    return (
        <>
            <View style={styles.tab_container}>
                <View style={styles.tab_wrapper}>
                    <Tab value={index}
                        onChange={setIndex}
                        variant={"default"}
                        indicatorStyle={styles.indicator}
                    >
                        {tabs.map(item => renderTab(item))}
                    </Tab>
                </View>
            </View>
            <TabView value={index} onChange={setIndex} >
                {React.Children.map(children, child => (<TabView.Item>
                    {child}
                </TabView.Item>))}
            </TabView>
        </>
    )
}

const styles = StyleSheet.create({
    tab_container: {
        backgroundColor: "black",
        alignSelf:'center'
    },
    tab_wrapper: {
        width: widthToDp('90'),
    },
    title: {
        fontSize: heightToDp('2.2'),
        textTransform: "capitalize",
        textAlign: "left",
        marginTop:heightToDp(-1.4)

    },
    container: {
        backgroundColor: "black"
    },
    buttonStyle: {
        marginTop:heightToDp('1'),
        backgroundColor: "black",
        height:heightToDp('5.5'),
    },
    indicator: {
        backgroundColor: "#d3d3d3",
        width: widthToDp('23'),
        height:heightToDp('0.3'),
        marginLeft: widthToDp('11'),
        borderRadius:10,
    }
})

export default memo(TabsView);