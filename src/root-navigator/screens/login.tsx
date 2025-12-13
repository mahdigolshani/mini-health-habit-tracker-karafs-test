import {Button, StyleSheet, View} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {RootNavigatorParamList} from '@/root-navigator';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/redux/store';
import {useCallback} from 'react';
import {login} from '@/redux/slices/user';

export type LoginScreenProps = StackScreenProps<
  RootNavigatorParamList<'unauthorized'>,
  'login'
>;

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleLoginAsUser = useCallback(() => {
    dispatch(login('user'));
  }, [dispatch]);
  const handleLoginAsGuest = useCallback(() => {
    dispatch(login('guest'));
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <Button onPress={handleLoginAsUser} title="Login as user" />
      <Button onPress={handleLoginAsGuest} title="Login as guest" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;
