import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native'

import Controller from '../controller';

export default class CameraController extends Controller {
    MOVE_X     = '/camera/x/'
    MOVE_Y     = '/camera/y/'
    HOME       = '/camera/home'

    constructor(props) {
        super(props);
        this.styles = require('./styles');

        this.apiParameters = {
            'x': '0',
            'y': '0',
            'initX': 0,
            'initY': 0,
            'updatedTime': new Date().getTime()
        };
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gesture) => {
                this.handleClick(e);
                gesture.dx = this.apiParameters.initX
                gesture.dy = this.apiParameters.initY
            },
            onPanResponderMove: (e, gesture) => {
                this.move(gesture.dx, gesture.dy);
                Animated.event([null, {
                    dx: this.state.pan.x,
                    dy: this.state.pan.y
                }])(e, gesture);
            },
            onPanResponderRelease: (e, gesture) => {
                this.apiParameters.initX = gesture.dx
                this.apiParameters.initY = gesture.dy
            }
        });
    }

    move(x, y) {
        let toUpdateTime = 100; // milliseconds
        let now = new Date().getTime();
        // Skip sending api if update in short period to avoid overloading
        if (now - this.apiParameters.updatedTime < toUpdateTime) return;
        this.apiParameters.updatedTime = now;

        let newX = Math.round((this.apiParameters.initX + 150 - x) / 300 * 100.0);
        newX = newX > 100 ? 100 : (newX < 0 ? 0 : newX);
        this.api.sendCommand(this.MOVE_X + newX);
        this.apiParameters.x = newX;

        let newY = Math.round((this.apiParameters.initY + 30 -y) / 300 * 100.0);
        newY = newY > 100 ? 100 : (newY < 0 ? 0 : newY);
        this.api.sendCommand(this.MOVE_Y + newY);
        this.apiParameters.y = newY;
    }

    // FIXME: Fix the logic to depend on window ratio instead of fixed number
    setOrientation(isPortrait) {
        let CIRCLE_RADIUS = 36;
        let Window = Dimensions.get('window');
        if (isPortrait) {
            this.styles.container = {
                position    : 'absolute',
                top: Window.height/2 - CIRCLE_RADIUS - 250,
                left: Window.width/2 - CIRCLE_RADIUS,
            }
        }
        else {
            this.styles.container = {
                position    : 'absolute',
                top         : Window.height/2 - CIRCLE_RADIUS + 100,
                left        : Window.width/2 - CIRCLE_RADIUS - 250,
            }
        }
    }

    stop() {
    }

    handleDoubleClick() {
        this.apiParameters.initX = 0;
        this.apiParameters.initY = 0;
        Animated.spring(
            this.state.pan,
            { toValue:{ x:0, y:0 } }
        ).start();
        this.api.sendCommand(this.HOME);
    }
}
