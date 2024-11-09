import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Content from "@/components/Content";

interface Props {
  children: any;
  colors: string[];
}

const AppGradient = ({ children, colors }: Props) => {
  return (
    <LinearGradient colors={colors} className="flex-1">
      <Content>{children}</Content>
    </LinearGradient>
  );
};

export default AppGradient;
