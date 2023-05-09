import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@rneui/themed";
import DetailScreen from "screens/DetailScreen";
import HomeScreen from "screens/HomeScreen";

export default function Navigator() {
  const { theme } = useTheme();
  
  const Stack = createNativeStackNavigator<{home: undefined, detail:{ id: number }}>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name='home' component={HomeScreen} options={{ title: "Home" }}/>
        <Stack.Screen name="detail" component={DetailScreen} options={{ title: "Detail" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}