import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface CardProps {
  title: string;
  body: string;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, body, onPress }) => {
  const CardContent = (
    <>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.body} numberOfLines={3}>
        {body}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{CardContent}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
