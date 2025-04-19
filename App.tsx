import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Provider as PaperProvider } from "react-native-paper"
import { AuthProvider } from "./src/contexts/AuthContext"
import { NetworkProvider } from "./src/contexts/NetworkContext"
import MainNavigator from "./src/navigation/MainNavigator"

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <PaperProvider>
      <NetworkProvider>
        <AuthProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </AuthProvider>
      </NetworkProvider>
    </PaperProvider>
  )
}

export default App
