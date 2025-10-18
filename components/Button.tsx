import { Text, TouchableOpacity } from "react-native";

interface IButton {
  className?: string;
  children: string;
}

export default function Button({ className, children }: IButton) {
  return (
    <TouchableOpacity
      className={
        "bg-[#e6491e] items-center justify-center py-[14px] px-[16px] rounded-[8px] mt-[32px]" +
        " " +
        className
      }
      activeOpacity={0.8}
    >
      <Text className="text-white">{children}</Text>
    </TouchableOpacity>
  );
}
