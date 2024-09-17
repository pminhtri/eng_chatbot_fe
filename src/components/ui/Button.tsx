import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { Button as MuiButton, ButtonProps } from "@mui/material";

import { Typography } from "./Typography";
import { TypographyTypes } from "../types";

const TABLET_BREAKPOINT = 640;

const StyledButton = styled(MuiButton)<ButtonProps & { transform?: boolean }>(({
  transform,
}) => {
  const baseStyle = {
    padding: "8px 10px 8px 10px",
    borderRadius: 8,
    minWidth: 100,
    boxShadow: "none",
    "&:hover": {
      boxShadow: "0px 2px 6px 0px rgba(50, 50, 50, 0.40)",
    },
    transition: "all 0.6s ease",
  };

  const circleStyle = {
    display: "flex",
    padding: 0,
    minWidth: 42,
    height: 42,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "none",
    "&:hover": {
      boxShadow: "0px 2px 6px 0px rgba(50, 50, 50, 0.40)",
    },
    transition: "all 0.6s ease",
  };

  return transform ? circleStyle : baseStyle;
});

type Props = {
  text: string;
  textType?: TypographyTypes;
  style?: {
    background?: string | number;
    color?: string;
  };
  transform?: boolean;
} & ButtonProps;

const useBreakpoint = (breakpoint: number) => {
  const [shouldBreak, setShouldBreak] = useState(
    window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    const handleResize = () => {
      setShouldBreak(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return shouldBreak;
};

export const Button: React.FC<Props> = ({
  text,
  textType,
  style,
  transform,
  startIcon,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  const { background, color } = style || {};

  const shouldTransform = transform && useBreakpoint(TABLET_BREAKPOINT);

  return (
    <StyledButton
      {...rest}
      transform={shouldTransform}
      startIcon={!shouldTransform && startIcon}
      style={{ background }}
    >
      {shouldTransform ? (
        startIcon
      ) : (
        <Typography type={textType || "title-4"} color={color}>
          {t(text)}
        </Typography>
      )}
    </StyledButton>
  );
};
