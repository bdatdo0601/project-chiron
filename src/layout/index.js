import React, { useContext } from "react";
import LayoutContext from "../context/layout";
import MainLayout from "./MainLayout";

export default function Layout(props) {
  const { layout } = useContext(LayoutContext);
  switch (layout) {
    default:
      return <MainLayout {...props} />;
  }
}
