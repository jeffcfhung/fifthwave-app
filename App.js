import React from 'react';
import {
  Dimensions,
  WebView,
  View,
  Text,
} from 'react-native';
import SteerController from './app/components/steer';
import CameraController from './app/components/camera';
import FaceRecController from './app/components/face';

const GLOBAL = require('./app/lib/globals');

const styles = require('./app/config/styles');


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debugLog: 'Messages',
      isPortrait: true,
    };
    this.logs = [];
  }

  // FIXME: Apply observers instead of direct accesss. This is just quick hacking
  componentDidMount() {
    GLOBAL.CUSTOM_EVENT.ViewPort = this;
    GLOBAL.CUSTOM_EVENT.setDebugLog = this.setDebugLog;
  }

  onLayout() {
    const { width, height } = Dimensions.get('window');
    const isPortrait = height > width;
    if (isPortrait) {
      styles.video = [{
        width: 400,
        height: 300,
      }];
    } else {
      styles.video = [{
        width: 480,
        height: 360,
      }];
    }

    this.setState({ isPortrait });
  }

  setDebugLog(input) {
    const log = new Date().toISOString().replace(/.*T/, ' ').replace(/Z.*/, ' ') + input;
    const logs = GLOBAL.CUSTOM_EVENT.ViewPort.logs;
    logs.unshift(log);
    if (logs.length > 4) {
      logs.splice(-1, 1);
    }
    GLOBAL.CUSTOM_EVENT.ViewPort.setState({ debugLog: logs.join('\n') });
  }

  static getVideoHtml() {
    return (
      `<html><body><img src="${GLOBAL.VIDEO_URL}" width="100%" style="background-color: white; min-height: 100%; min-width: 100%; position: fixed; top: 0; left: 0;"></body></html>`
    );
  }

  getDebugComponent() {
    if (this.state.isPortrait) {
        return (
            <View style={styles.tabBar}>
                <Text>{this.state.debugLog}</Text>
            </View>
        );
    }
}

render() {
    return (
        <View onLayout={this.onLayout.bind(this)} style={styles.mainContainer}>
            <View style={this.state.isPortrait && styles.navBar}>
                  <Text style={styles.navBarButton}>Back</Text>
                  <Text style={styles.navBarHeader}>Smart Car</Text>
                  <Text style={styles.navBarButton}>More</Text>
              </View>
              <View style={styles.content}>
                  <View style={styles.video}>
                      <WebView
                         style={styles.video}
                         automaticallyAdjustContentInsets={true}
                         scalesPageToFit={true}
                         startInLoadingState={false}
                         scrollEnabled={true}
                         source={{html: App.getVideoHtml(), baseUrl: '/'}} />
                      <FaceRecController name='Unknown' data={this.state} />
                  </View>
                  <CameraController name='Camera Control' data={this.state} />
                  <SteerController name='Steer Control' data={this.state} />
              </View>
              {this.getDebugComponent()}
              {/*}
              <View style={styles.tabBar}>
                  <View style={[styles.tabBarButton, styles.button1]} />
                  <View style={[styles.tabBarButton, styles.button2]} />
                  <View style={[styles.tabBarButton, styles.button3]} />
                  <View style={[styles.tabBarButton, styles.button4]} />
                  <View style={[styles.tabBarButton, styles.button5]} />
              </View>
              {*/}
          </View>
      );
  }
}
