// App.js ou outro arquivo de entrada
import React, { useEffect, useState } from "react";
import {
  View, Button, Text, StyleSheet
  
 } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import * as Notifications from "expo-notifications";

const TASK_NAME = "minha-tarefa";

// 1. Define a task globalmente (fora do componente)
TaskManager.defineTask(TASK_NAME, async () => { 

  const { status } = await Notifications.requestPermissionsAsync();
  if (status === "granted") {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Hora de beber água!",
        body: "Fique hidratado e saudável.",
      },
      trigger: null,
    });
    return BackgroundTask.BackgroundTaskResult.Success;
  }
  return BackgroundTask.BackgroundTaskResult.Failed;
});

// Define handler de notificações. Como vai ser executada a notificação.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [status, setStatus] = useState("Verificando...");
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    updateStatus();
    // configNotify();
  }, []);


  // Função teste que pode ser chamanda quando o app é aberto
  async function configNotify() {
    const { status } = await Notifications.requestPermissionsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Hora de beber água!",
        body: "Fique hidratado e saudável.",
      },
      trigger: null,
    });
  }


  //Atualiza os estados dos registros
  async function updateStatus() {
    const stat = await BackgroundTask.getStatusAsync();
    const registered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    setStatus(BackgroundTask.BackgroundTaskStatus[stat] || stat);
    setIsRegistered(registered);
    console.log("Status:", stat, "Registrada:", registered);
  }


  // Registra a tarefa
  const registerTask = async () => {
    await BackgroundTask.registerTaskAsync(TASK_NAME, { minimumInterval: 15 });
    console.log("✅ Tarefa registrada");
    updateStatus();
  };

    // Remove a tarefa
  const unregisterTask = async () => {
    await BackgroundTask.unregisterTaskAsync(TASK_NAME);
    console.log("❌ Tarefa cancelada");
    updateStatus();
  };


  // Não funciona muito bem os testes
  const runTestTask = async () => {
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
    console.log("🏃 Tarefa executada manualmente");
  };

  return (
    <View style={styles.container}>
      <Text>Status da tarefa: {status}</Text>
      <Text>Tarefa registrada? {isRegistered ? "Sim" : "Não"}</Text>
      <Button title="Registrar tarefa" onPress={registerTask} />
      <Button title="Desregistrar tarefa" onPress={unregisterTask} />
      <Button title="Executar tarefa agora" onPress={runTestTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
    justifyContent: "center",
  },
});
