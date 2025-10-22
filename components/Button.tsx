import { Text, TouchableOpacity } from "react-native";

interface IButton {
  className?: string;
  children: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function Button({ className, children, onPress, disabled = false }: IButton) {
  return (
    <TouchableOpacity
      className={
        "bg-[#e6491e] items-center justify-center py-[14px] px-[16px] rounded-[8px] mt-[32px]" +
        " " +
        className +
        (disabled ? " opacity-50" : "")
      }
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white">{children}</Text>
    </TouchableOpacity>
  );
}
