import { TextInputProps } from 'react-native';
import React from 'react';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export interface ButtonProps {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
}

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface CardProps {
  title: string;
  body: string;
  onPress?: () => void;
}
