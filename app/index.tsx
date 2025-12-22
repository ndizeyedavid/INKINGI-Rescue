import { Redirect } from "expo-router";
import { LogBox } from "react-native";

import "../global.css";
LogBox.ignoreAllLogs(); // Ignore all log notifications

export default function Index() {
  return <Redirect href="/(splash)/splash" />;
}
