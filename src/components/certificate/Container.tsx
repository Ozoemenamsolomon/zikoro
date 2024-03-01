import { useNode } from "@craftjs/core";
// import { Slider } from "@material-ui/core";
// import { Paper, FormControl, FormLabel } from "@material-ui/core";
// import ColorPicker from "material-ui-color-picker";
import React from "react";
import { FormControl, FormLabel } from "../ui/form";
import { Slider } from "../ui/slider";


interface ContainerProps {
  className: string;
  children: React.ReactNode;
}

const Container = ({ children, className }: ContainerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div className={className} ref={(ref) => connect(drag(ref))}>
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div>
      <div>Background</div>
      {/* <ColorPicker
        name="background-color"
        value={background}
        onChange={(color) => {
          setProp((props) => (props.background = color), 500);
        }}
      /> */}
    </div>
  );
};

export const ContainerDefaultProps = {
  className: "",
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};

export default Container;
