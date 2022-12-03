import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tab, TabView } from 'react-native-elements';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';


const Tabs = {
    experts: "Followers",
    careerPortal: "Following"
}

const FollowTabs = ({ children }) => {

    const [index, setIndex] = React.useState(0);

    const theIndex = (num) => {
        setIndex(num);
    }

    const tabs = [
        { tabTndex: 0, title: Tabs.experts },
        { tabTndex: 1, title: Tabs.careerPortal }];

    const renderTab = ({ tabTndex, title }) => {
        return (
            <Tab.Item
                containerStyle={styles.container}
                title={title}
                titleStyle={[
                    styles.title,
                    { fontFamily: index === tabTndex ? "Poppins-SemiBold" : "Poppins-Regular" }
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
                        variant={"primary"}
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
        backgroundColor: "#202020",
    },
    tab_wrapper: {
        width: widthToDp('100'),
    },
    title: {
        fontSize: heightToDp('1.8'),
        color: '#FF5F6D',
        textTransform: "capitalize",
        textAlign: "left",
        marginTop:heightToDp(0)

    },
    container: {
        backgroundColor: "#202020"
    },
    buttonStyle: {
        backgroundColor: "#202020",
        height:heightToDp('7'),
    },
    indicator: {
        backgroundColor: "#d3d3d3",
        width: widthToDp('35'),
        height:heightToDp('0.3'),
        marginLeft: widthToDp('8'),
        borderRadius:10,
    }
})

export default memo(FollowTabs);