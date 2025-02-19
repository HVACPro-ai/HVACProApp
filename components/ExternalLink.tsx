import React from 'react';
import { Pressable } from 'react-native';
import * as Linking from 'expo-linking';

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <Pressable onPress={() => Linking.openURL(href)}>
      {children}
    </Pressable>
  );
} 