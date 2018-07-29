'use strict'
const React = require('react-native')
import {
    StyleSheet,
    Dimensions
} from 'react-native';

let CIRCLE_RADIUS = 36;
let Window = Dimensions.get('window');
module.exports = StyleSheet.create({
    container: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS + 100,
        left        : Window.width/2 - CIRCLE_RADIUS - 250,
    },
    text: {
        marginTop   : 20,
        marginLeft  : 5,
        marginRight : 5,
        textAlign   : 'center',
        color       : '#fff'
    },
    circle: {
        backgroundColor     : '#8a9c3c',
        opacity             : 0.7,
        width               : CIRCLE_RADIUS*2,
        height              : CIRCLE_RADIUS*2,
        borderRadius        : CIRCLE_RADIUS
    },
    outter_circle: {
        backgroundColor     : '#9a9c3c',
        width               : CIRCLE_RADIUS*3,
        height              : CIRCLE_RADIUS*3,
        borderRadius        : CIRCLE_RADIUS*1.5
    }
})
