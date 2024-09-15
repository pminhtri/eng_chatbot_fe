import React from "react";
import { useTranslation } from "react-i18next";
import {
  Typography as MuiTypography,
  TypographyProps as MuiTypographyProps,
} from "@mui/material";

import { typography, TypographyTypes } from "../types";

type TypographyProps = {
  type: TypographyTypes;
  color?: string;
  component?: string;
  className?: string;
  display?: "initial" | "block" | "inline";
} & MuiTypographyProps;

type PropsWithTranslationKey = {
  translationKey: string;
  translationOptions?: Record<string, string>;
  children?: React.ReactNode;
} & TypographyProps;

type PropsWithChildren = {
  children: React.ReactNode;
  translationKey?: string;
  translationOptions?: Record<string, string>;
} & TypographyProps;

type Props = PropsWithTranslationKey | PropsWithChildren;

export const Typography: React.FC<Props> = ({
  type,
  color,
  className,
  children,
  translationKey,
  translationOptions,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  const displayContent = (
    <>
      {translationKey && t(translationKey, translationOptions)}
      {children === "" ? undefined : children}
    </>
  );

  return (
    <MuiTypography
      sx={{ ...typography[type], ...(color ? { color } : {}) }}
      className={className}
      {...rest}
    >
      {displayContent}
    </MuiTypography>
  );
};
