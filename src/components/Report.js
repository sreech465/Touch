import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { heightToDp, widthToDp } from '../Assets/helpers/Responsive';
import { useDispatch, useSelector } from 'react-redux';
import { reportAction } from '../Redux/reducers/feedReducer';
import { LoadingView } from './LoadingView';
import AnimatedModal from './AnimatedModal';

const defaultReportOptions = [
    {
        optionText: "It's spam",
        key: 1
    },
    {
        optionText: "I just don't like it",
        key: 2
    },
    {
        optionText: "False information",
        key: 3
    },
]

// Use this reusable report component for reporting posts, stories, reels, user profiles.

const Report = ({ content_type, content_id, content_owner_id, reportOptions = defaultReportOptions, reportStatus, isVisible, hideModal }) => {

    const owner = useSelector(state => state.user.userdata);

    const dispatch = useDispatch();

    const [resMsg, setResMsg] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        var ownerReportErr = `You cannot report your own ${content_type.toLowerCase()}.`;

        const alreadyReportedMsg = 'Already reported';

        if (content_type === "USER") {
            ownerReportErr = `You cannot report your own profile.`;
        }

        if (content_owner_id === owner.userid) {
            setResMsg(ownerReportErr);
        }

        if (reportStatus === "Already reported") {
            setResMsg(alreadyReportedMsg);
        }

    }, [])

    const handleReport = (item) => {
        setIsLoading(true);

        const reportData = {
            type: content_type,
            user_id: content_owner_id,
            id: content_id,
            reason: item.optionText
        };

        dispatch(reportAction(reportData))
            .unwrap()
            .then(res => {
                setResMsg(res.message)
            })
            .catch(({ errors }) => {
                setResMsg(errors.map((error) => error.msg).join("\r\n"));
            }
            )
            .finally(() => { setIsLoading(false) });
    }

    const renderReportOptions = ({ item }) => {
        return <TouchableOpacity onPress={() => handleReport(item)} >
            <Text style={styles.reportOption}>{item.optionText}</Text>
        </TouchableOpacity>
    }

    return (
        <>
            <LoadingView modalVisible={isLoading} />
            <AnimatedModal isVisible={isVisible} hideModal={hideModal} headerText="Report">
                <Text style={styles.reportQues}>{`Why are you reporting this ${content_type.toLowerCase()} ?`}</Text>
                <Text style={styles.reportNote}>Your report is anonymous, except if you're reporting
                    an intellectual property infringement.</Text>
                {resMsg ? <Text style={styles.responseText}>{resMsg}</Text> : <FlatList
                    data={reportOptions}
                    renderItem={renderReportOptions}
                />}
            </AnimatedModal>
        </>
    )
}

const styles = StyleSheet.create({
    reportQues: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: heightToDp('1')
    },
    reportNote: {
        color: 'gray',
        marginBottom: heightToDp('1')
    },
    reportOption: {
        color: 'white',
        padding: widthToDp('3')
    },
    responseText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: widthToDp('5'),
        marginTop: heightToDp('2')
    }
})

export default Report;
