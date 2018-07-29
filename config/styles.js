'use strict'
const React = require('react-native')
const { StyleSheet } = React;

module.exports = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    navBar: {
        flexDirection: 'row',
        paddingTop: 30,
        height: 64,
        backgroundColor: '#1EAAF1'
    },
    navBarButton: {
        color: '#FFFFFF',
        textAlign:'center',
        width: 64
    },
    navBarHeader: {
        flex: 1,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    video: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugLog: {
    },
    text: {
        color: '#222222'
    },
    tabBar: {
        flexDirection: 'row',
        height: 100
    },
    tabBarButton: {
        flex: 1
    },
    button1: { backgroundColor: '#8BC051' },
    button2: { backgroundColor: '#CCD948' },
    button3: { backgroundColor: '#FDE84D' },
    button4: { backgroundColor: '#FCBF2E' },
    button5: { backgroundColor: '#FC9626' }
})
