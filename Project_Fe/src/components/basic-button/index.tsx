import { forwardRef } from "react";
import type { ButtonProps } from "antd";
import { Button } from "antd";
import type { ReactNode } from "react";

interface BasicButtonProps extends ButtonProps {
  children?: ReactNode;
}

export const BasicButton = forwardRef<HTMLButtonElement, BasicButtonProps>(
  function BasicButton(props, ref) {
    const { children, ...restProps } = props;

    return (
      <Button ref={ref} type="primary" {...restProps}>
        {children}
      </Button>
    );
  }
);
