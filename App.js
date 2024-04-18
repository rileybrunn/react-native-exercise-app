import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native'
import { useState, useCallback, useEffect } from 'react'
import * as Font from 'expo-font'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'


async function cacheFonts(fonts) {
  return fonts.map(async (font) => await Font.loadAsync(font))
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingBottom: 15,
    paddingTop: 15,
  },
  buttonContainer: {
    marginVertical: 10,
    width: 200,
  },
  button: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#55D6BE',
    alignItems: 'center',
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})


const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='RepetitionExercise' component={RepetitionExercise} />
        <Stack.Screen name='DurationExercise' component={DurationExercise} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


function Home({ navigation }) {
  cacheFonts([FontAwesome.font])

  const exercises = [
    { name: 'Push Ups', type: 'repetition', suggested: 'Planks' },
    { name: 'Running', type: 'duration', suggested: 'Swimming' },
    { name: 'Planks', type: 'repetition', suggested: 'Push Ups' },
    { name: 'Swimming', type: 'duration', suggested: 'Running' },
  ]

  const ExerciseButton = ({ name, onPress }) => (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        title={name}
        onPress={onPress}
        style={styles.button}>
        <Text style={styles.buttonText}>{name}</Text>
      </TouchableOpacity>
    </View>
  )

  let renderItem = ({ item }) => (
    <ExerciseButton
      name={item.name}
      onPress={() =>
        navigation.navigate(
          item.type === 'repetition' ? 'RepetitionExercise' : 'DurationExercise',
          { name: item.name, suggested: item.suggested }
        )
      }
      suggested={item.suggested}
    ></ExerciseButton>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Exercises</Text>
      <FlatList
        data={exercises}
        renderItem={renderItem}
      />
    </View>
  )
}


function RepetitionExercise({ route, navigation }) {
  cacheFonts([FontAwesome.font])
  const { name, suggested } = route.params
  let [count, setCount] = useState(0)

  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>{name}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('RepetitionExercise', {name: route.params.suggested, suggested: route.params.name})}
        style={styles.button}>
        <Text style={styles.buttonText}>Suggested: {suggested}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>Rep Count: {count}</Text>
      <TouchableOpacity
        onPress={() => setCount(count => count + 1)}
        style={styles.button}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCount(0)}
        style={styles.button}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.button}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  )
}


let currentTimer = 0
function DurationExercise({ route, navigation }) {
  cacheFonts([FontAwesome.font])
  const { name, suggested } = route.params

  let [running, setRunning] = useState(false)
  let [timer, setTimer] = useState(0)
  let updateTimer = useCallback(() => {
    if (running) {
      setTimer((timer) => timer + 10)
    }
  }, [running])
  useEffect(() => {
    currentTimer = setInterval(updateTimer, 10)
    return () => clearInterval(currentTimer)
  }, [running])
  let startStop = useCallback(() => {
    setRunning(!running)
    clearInterval(currentTimer)
  }, [running])
  let reset = useCallback(() => {
    setTimer(0)
  })
  let mins = (Math.floor((timer / (1000 * 60)) % 60)).toString().padStart(2, "0")
  let secs = (Math.floor((timer / 1000) % 60)).toString().padStart(2, "0")
  let mills = (timer % 1000).toString().padStart(3, "0")

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('DurationExercise', {name: route.params.suggested, suggested: route.params.name})}
        style={styles.button}>
        <Text style={styles.buttonText}>Suggested: {suggested}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        {mins}:{secs}.{mills}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={startStop}>
        <Text style={styles.buttonText}>{running ? "Pause" : "Start"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={reset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.button}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  )
}