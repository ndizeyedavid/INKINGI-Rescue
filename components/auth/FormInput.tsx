import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TextInput, View } from "react-native";

interface IFormInput {
  label: string;
  placeholder: string;
  icon: string | any;
  keyboardType:
    | "email-address"
    | "default"
    | "numeric"
    | "phone-pad"
    | "decimal-pad"
    | "number-pad"
    | "visible-password";
  secureTextEntry?: boolean;
}

export default function FormInput({
  label,
  placeholder,
  icon,
  keyboardType,
  secureTextEntry = false,
}: IFormInput) {
  return (
    <View className="gap-2">
      <Text className="text-[16px] text-[#150502]">{label}</Text>

      <View className="flex-row w-full">
        <Ionicons name={icon} size={22} className="absolute top-4 left-4" />
        <TextInput
          className="border border-black/40 w-full focus:border-[#e6491e] px-[16px] py-[14px] pl-[40px] rounded-[16px]"
          placeholder={placeholder}
          placeholderTextColor={"rgba(0,0,0,0.3)"}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
}
