import {CompositeScreenProps} from '@react-navigation/native';
import {
  type HabitsNavigatorScreenProps,
  type HabitsParamList,
} from '@/root-navigator/screens/main/screens/habits';
import {type StackScreenProps} from '@react-navigation/stack';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addHabit, habitSelector, updateHabit} from '@/redux/slices/habits';
import {useCallback, useRef, useState} from 'react';
import {Button} from 'react-native-web';
import {type AppDispatch} from '@/redux/store';
import {Habit} from '@/redux/slices/habits/types';

export type UpsertScreenProps = CompositeScreenProps<
  StackScreenProps<HabitsParamList, 'upsert'>,
  HabitsNavigatorScreenProps
>;

const initialHabit: Pick<Habit, 'title' | 'description' | 'target'> = {
  title: '',
  description: '',
  target: 0,
};

const UpsertScreen = ({route, navigation}: UpsertScreenProps) => {
  const storedHabit = useSelector(habitSelector(route.params?.habitId));
  const [habit, setHabit] = useState<
    Habit | Pick<Habit, 'title' | 'description' | 'target'>
  >(storedHabit ?? initialHabit);
  const dispatch = useDispatch<AppDispatch>();

  const handleNameInputChange = useRef((text: string) => {
    setHabit(prev => ({...prev, title: text}));
  }).current;

  const handleDescriptionInputChange = useRef((text: string) => {
    setHabit(prev => ({...prev, description: text}));
  }).current;

  const handleTargetInputChange = useRef((text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setHabit(prev => ({...prev, target: parseInt(numericText) || 0}));
  }).current;

  const handleSubmit = useCallback(() => {
    if ('id' in habit) {
      dispatch(updateHabit(habit));
    } else {
      dispatch(addHabit(habit));
    }
    navigation.goBack();
  }, [habit, dispatch, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Drink 8 glasses of water"
          defaultValue={habit?.title}
          onChangeText={handleNameInputChange}
          placeholderTextColor={'grey'}
        />
      </View>
      <View>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Drinking eight glasses of water each day is a healthy daily habit focused on maintaining proper hydration..."
          defaultValue={habit?.description}
          onChangeText={handleDescriptionInputChange}
          placeholderTextColor={'grey'}
        />
      </View>
      <View>
        <Text style={styles.label}>Target: </Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 8"
          value={habit?.target.toString()}
          onChangeText={handleTargetInputChange}
          placeholderTextColor={'grey'}
          keyboardType="numeric"
        />
      </View>
      <Button
        title={'id' in habit ? 'Update Habit' : 'Create Habit'}
        onPress={handleSubmit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    rowGap: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
  },
});

export default UpsertScreen;
