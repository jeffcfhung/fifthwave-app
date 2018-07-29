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
import styles from './styles'

export default class SteerController extends Controller {
    FORWARD     = '/motor/forward';
    BACKWARD    = '/motor/backward';
    STOP        = '/motor/stop';
    TURNING     = '/turning/';
    SET_SPEED   = '/motor/set/speed/';

    constructor(props) {
        super(props);
        this.styles = require('./styles');
        // initial apiParameters
        this.apiParameters = {
            'speed': '0',
            'direction': this.STOP,
            'turningAngle': '127', // Center
            'updatedTime': new Date().getTime()
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (e, gesture) => {
                this.handleClick(e);
            },
            onPanResponderMove: (e, gesture) => {
                this.move(gesture.dx, gesture.dy);
                Animated.event([null, {
                    dx: this.state.pan.x,
                    dy: this.state.pan.y
                }])(e, gesture);
            },
            onPanResponderRelease: (e, gesture) => {
                this.stop()
                Animated.spring(
                    this.state.pan,
                    { toValue:{ x:0, y:0 } }
                ).start();
            }
        });
    }

    // FIXME: Make set orientation easier
    setOrientation(isPortrait) {
        let CIRCLE_RADIUS = 36;
        let Window = Dimensions.get('window');
        if (isPortrait) {
            this.styles.container = {
                position    : 'absolute',
                top: Window.height/2 - CIRCLE_RADIUS + 100,
                left: Window.width/2 - CIRCLE_RADIUS
            }
        }
        else {
            this.styles.container = {
                position    : 'absolute',
                top         : Window.height/2 - CIRCLE_RADIUS + 100,
                left        : Window.width/2 - CIRCLE_RADIUS + 250,
            }
        }
    }

    move(x, y) {
        let toUpdateTime = 300; // milliseconds
        let now = new Date().getTime();
        // Skip sending api if update in short period to avoid overloading
        if (now - this.apiParameters.updatedTime < toUpdateTime) return;
        this.apiParameters.updatedTime = now;

        this._changeDirection(y);
        this._changeSpeed(x, y);
        this._changeTurning(x);
    }

    stop() {
        this._changeDirection(0);
        this._changeSpeed(0, 0);
        this._changeTurning(0);
    }

    _changeDirection(y) {
        let direction = y < 0 ? this.FORWARD : (y > 0 ? this.BACKWARD : this.STOP);
        if (this.apiParameters.direction == direction) return;

        this.apiParameters.direction = direction;
        this.api.sendCommand(direction);
    }

    _changeSpeed(x, y) {
        let speed = Math.round(Math.sqrt(x*x + y*y));
        speed = speed > 100 ? 100 : (speed < 0 ? 0 : speed);
        if (this.apiParameters.speed == speed) return;

        this.apiParameters.speed = speed;
        this.api.sendCommand(this.SET_SPEED + speed);
    }

    _changeTurning(x) {
        let angle = Math.round((x - (-150)) / 300 * 255);
        angle = angle > 255 ? 255 : (angle < 0 ? 0 : angle);
        if (this.apiParameters.turningAngle == angle) return;

        this.apiParameters.turningAngle = angle;
        this.api.sendCommand(this.TURNING + angle);
    }
}
