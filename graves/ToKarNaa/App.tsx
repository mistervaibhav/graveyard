import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, ToastAndroid, Platform } from "react-native";
import { Provider as PaperProvider, Appbar, FAB } from "react-native-paper";

const App = () => {
  function notifyMessage(msg: string) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

  return (
    <PaperProvider>
      <Appbar.Header dark>
        <Appbar.BackAction onPress={() => notifyMessage("Went back")} />
        <Appbar.Action
          icon="archive"
          onPress={() => notifyMessage("Pressed archive")}
        />
        <Appbar.Action
          icon="mail"
          onPress={() => notifyMessage("Pressed mail")}
        />
        <Appbar.Action
          icon="label"
          onPress={() => notifyMessage("Pressed label")}
        />
      </Appbar.Header>
      <Text>HOLA !! 👋</Text>
      <FAB
        style={styles.fab}
        label="Create task"
        icon="plus"
        onPress={() => notifyMessage("Pressed")}
      />
      <StatusBar style="auto" />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default App;
