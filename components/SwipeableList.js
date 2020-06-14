import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Animated, {
  useCode,
  block,
  cond,
  eq,
  add,
  set,
  Value,
  SpringUtils,
  clockRunning,
  startClock,
  spring,
  not,
  stopClock,
} from 'react-native-reanimated';
import {
  useValue,
  usePanGestureHandler,
  snapPoint,
  timing,
  useClock,
} from 'react-native-redash';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SwipeableList = ({data, renderItems, initialScale, borderRadius}) => {
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [fullScreen, setFullScreen] = useState(false);
  const insets = useSafeAreaInsets();
  const translateX = useValue(0);
  const offsetX = useValue(0);
  const progress = useValue(0);
  const scale = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [initialScale, 1],
  });

  const headerTranslateY = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const translateY = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [0, -40],
  });
  const clock = useClock();

  const {gestureHandler, state, velocity, translation} = usePanGestureHandler();
  const top = Platform.OS === 'ios' ? 80 - insets.bottom : 40;
  const snapPoints = data.map((_, index) => index * -windowWidth);
  const to = snapPoint(translateX, velocity.x, snapPoints);

  useCode(() => {
    return block([
      cond(eq(state, State.ACTIVE), [
        set(translateX, add(offsetX, translation.x)),
      ]),
      cond(eq(state, State.END), [
        set(translateX, timing({from: translateX, to})),
        set(offsetX, translateX),
      ]),
    ]);
  }, []);

  useCode(() => {
    const cstate = {
      finished: new Value(0),
      position: progress,
      velocity: new Value(0),
      time: new Value(0),
    };

    const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
      ...SpringUtils.makeDefaultConfig(),
      bounciness: 4,
      speed: 4,
      toValue: new Value(fullScreen ? 1 : 0),
    });

    const reset = [
      set(cstate.finished, 0),
      set(cstate.velocity, 0),
      set(cstate.time, 0),

      startClock(clock),
    ];
    const end = [stopClock(clock)];

    return block([
      cond(not(clockRunning(clock)), reset),
      spring(clock, cstate, config),
      set(progress, cstate.position),
      cond(cstate.finished, end),
    ]);
  }, [fullScreen]);

  const onTapGesture = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <PanGestureHandler {...gestureHandler} enabled={!fullScreen}>
      <Animated.View
        style={[
          styles.container,
          {top: insets.top},
          {bottom: insets.bottom},
          {width: windowWidth * data.length},
        ]}>
        {data.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.sheet,
              {left: Dimensions.get('window').width * index},
              {transform: [{translateX: translateX}]},
            ]}>
            <Animated.View
              style={[
                styles.item,
                {
                  height: windowHeight - insets.top - insets.bottom,
                },
                {top},
                {width: windowWidth},
                {borderRadius},
                {transform: [{scale}, {translateY}]},
              ]}>
              <TouchableOpacity
                disabled={fullScreen}
                activeOpacity={1}
                style={styles.full}
                onPress={onTapGesture}>
                <View
                  style={styles.full}
                  pointerEvents={fullScreen ? 'auto' : 'none'}>
                  {renderItems(item, index)}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        ))}
        <Animated.View
          style={[
            styles.header,
            {width: windowWidth},
            {transform: [{translateY: headerTranslateY}]},
          ]}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sheet: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SwipeableList;
