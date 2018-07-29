'use strict'
const React = require('react-native')
import {
    StyleSheet,
    Dimensions
} from 'react-native';

module.exports = StyleSheet.create({
    container: {
        position    : 'absolute',
    },
    text: {
        textAlign: 'center',
        color: 'black',
        backgroundColor: 'grey',
    },
    rect: {
        opacity             : 0.7,
        borderWidth         : 1,
        borderColor         : 'red'
    }
})
