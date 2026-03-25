import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../config/ThemeContext';

export interface CardProps {
  title: string;
  body: string;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, body, onPress }) => {
  const { colors } = useTheme();

  const CardContent = (
    <>
      <Text style={styles(colors).title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles(colors).body} numberOfLines={3}>
        {body}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles(colors).card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles(colors).card}>{CardContent}</View>;
};

const styles = (colors: any) => StyleSheet.create({
  card: {
    backgroundColor: colors.input.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
