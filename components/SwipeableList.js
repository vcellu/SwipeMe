import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  View,
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
  call,
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
  const [fullScreen, setFullScreen] = useState(false);
  const insets = useSafeAreaInsets();
  const translateX = useValue(0);
  const offsetX = useValue(0);
  const scale = useValue(initialScale);
  const clock = useClock();

  const {gestureHandler, state, velocity, translation} = usePanGestureHandler();
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
    const state = {
      finished: new Value(0),
      position: scale,
      velocity: new Value(0),
      time: new Value(0),
    };

    const config = SpringUtils.makeConfigFromBouncinessAndSpeed({
      ...SpringUtils.makeDefaultConfig(),
      bounciness: 4,
      speed: 4,
      toValue: new Value(fullScreen ? 1 : initialScale),
    });
    const reset = [
      set(state.finished, 0),
      set(state.velocity, 0),
      set(state.time, 0),
      startClock(clock),
    ];
    const end =[
      stopClock(clock),
    ];

    return block([
      cond(not(clockRunning(clock)), reset),
      spring(clock, state, config),
      set(scale, state.position),
      cond(state.finished, end),
    ]);
  }, [fullScreen]);

  const onTapGesture = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <PanGestureHandler {...gestureHandler}>
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
              style={[styles.item, {borderRadius}, {transform: [{scale}]}]}>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.full}
                onPress={onTapGesture}>
                <View style={styles.full} pointerEvents="none">
                  {renderItems(item, index)}
                </View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        ))}
        <Animated.View style={[styles.header, {width: windowWidth}]} />
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
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    top: 80,
  },
  item: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
});

export default SwipeableList;
