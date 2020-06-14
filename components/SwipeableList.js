import React from 'react';
import {StyleSheet, Dimensions, useWindowDimensions} from 'react-native';
import Animated, {
  useCode,
  block,
  cond,
  eq,
  add,
  set,
} from 'react-native-reanimated';
import {
  useValue,
  usePanGestureHandler,
  snapPoint,
  timing,
} from 'react-native-redash';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const SwipeableList = ({data, renderItems}) => {
  const windowWidth = useWindowDimensions().width;
  const translateX = useValue(0);
  const offsetX = useValue(0);
  const {gestureHandler, state, velocity, translation} = usePanGestureHandler();
  const scale = 0.9;
  const snapPoints = data.map((_, index) => index * -windowWidth);
  console.log(snapPoints);
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

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={[styles.container, {width: windowWidth * data.length}]}>
        {data.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.sheet,
              {left: Dimensions.get('window').width * index},
              {transform: [{translateX: translateX}]},
            ]}
            pointerEvents="none">
            <Animated.View style={[styles.item, {transform: [{scale}]}]}>
              {renderItems(item, index)}
            </Animated.View>
          </Animated.View>
        ))}
        <Animated.View style={[styles.header, {width: windowWidth}]} />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: 40,
    flexDirection: 'row',
    backgroundColor: '#F0F0F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
  },
  sheet: {
    ...StyleSheet.absoluteFillObject,
    width: Dimensions.get('window').width,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    top: 80,
  },
  item: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default SwipeableList;
