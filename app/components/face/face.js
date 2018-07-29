import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native'

import CarApi from '../../api/car_api'

let GLOBAL = require('../../lib/globals');
let Window = Dimensions.get('window');
let timeInterval = 1000;

export default class FaceRecController extends React.Component {
    FAIL_DELAY = 12000;
    constructor(props) {
        super(props);
        this.defaultState = {
            top:    0,
            left:   0,
            width:  100,
            height: 100,
            name:   'Not found'
        };
        this.state = this.defaultState;

        this.styles = require('./styles');
        this.isFailing = false;

        // This ratio comes from mapping of image pixels and display area
        this.xRatio = 400.0/640.0;
        this.yRatio = 300.0/480.0;
    }

    componentDidMount() {
        this.api = new CarApi();
        // FIXME: This is a hack to do fast prototyping
        this.api.baseurl = GLOBAL.ML_URL + ':5000';
        this.findFacePosition()
        this.timer = setInterval(this.findFacePosition.bind(this), timeInterval);
        console.log('timeInterval... %d' + timeInterval);
    }

    findFacePosition() {
        const now = new Date().getTime();

        if (this.isFailing) {
            if (this.sendTime && (now - this.sendTime) < this.FAIL_DELAY) {
                console.log('ML connection fallback...');
                timeInterval = 10000;
                return;
            }
        }

        this.api.sendJsonCommand('/',
            this.facePositionFound.bind(this),
            this.errorCallback.bind(this)
        );
        this.sendTime = now;
        timeInterval = 1000;
    }

    errorCallback() {
        this.isFailing = true;
    }

    facePositionFound(responseData) {
        // FIXME: Multiple faces location
        console.log(responseData);
        /*
        The node coordiation is (y1, x1, y2, x2)
        We need to trasfer them to hight and width per ratio
        (y-0)/300 = (y1-0)/480 => y = y1*300/480 = y1*this.yRatio
        (x-0)/400 = (x1-0)/640 => x = x1*400/640 = x1*this.xRatio
        height = (y2-y1)*this.yRatio
        width = (x2-x1)*this.xRatio
        */

        const positions = responseData.positions;
        console.log(positions);
        const face_names = responseData['face_names'];

        // top, right, bottom, left
        if (positions.length > 0) {
            const node = positions[0];
            const top = parseInt(node[0]*this.yRatio) - 20;
            const left = parseInt(node[3]*this.xRatio);
            const height = parseInt((node[2]-node[0])*this.yRatio) + 20;
            const width = parseInt((node[1]-node[3])*this.xRatio);
            this.setState({
                top: top,
                left: left,
                height: height,
                width: width,
                name: face_names[0]
            });
            GLOBAL.CUSTOM_EVENT.setDebugLog(
                face_names[0] + ' : ' + top + ',' +
                left + ',' +
                height + ',' +
                width
            );
        }
        else {
            this.setState(this.defaultState);
        }
        this.isFailing = false;
        return responseData;
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={[this.styles.container, {top: this.state.top, left: this.state.left}]}>
                <View style={[this.styles.rect, {width: this.state.width, height: this.state.height}]}>
                    <Text style={this.styles.text}>{this.state.name}</Text>
                </View>
            </View>
        );
    }
}
