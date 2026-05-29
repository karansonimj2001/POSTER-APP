/**
 * Bottom action bar with Download, Edit, Share, WhatsApp buttons.
 * Used inside TemplateCard.
 */
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { DownloadIcon, PencilIcon, LinkIcon, ChatIcon } from './Icons'

interface ActionButtonBarProps {
  onDownload?: () => void
  onEdit?: () => void
  onShare?: () => void
  onWhatsApp?: () => void
  labels?: {
    download?: string
    edit?: string
    share?: string
    whatsapp?: string
  }
  iconSize?: number
}

export default function ActionButtonBar({ onDownload, onEdit, onShare, onWhatsApp, labels, iconSize = 14 }: ActionButtonBarProps) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.btn} onPress={onDownload}>
        <DownloadIcon size={iconSize} color="#FFFFFF" />
        <Text style={styles.label}>{labels?.download || 'Download'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onEdit}>
        <PencilIcon size={iconSize} color="#FFFFFF" />
        <Text style={styles.label}>{labels?.edit || 'Edit'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onShare}>
        <LinkIcon size={iconSize} color="#FFFFFF" />
        <Text style={styles.label}>{labels?.share || 'Share'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={onWhatsApp}>
        <ChatIcon size={iconSize} color="#22C55E" />
        <Text style={[styles.label, styles.whatsappLabel]}>{labels?.whatsapp || 'WhatsApp'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#8E8FCA',
    fontSize: 7.5,
    fontWeight: 'bold',
    marginTop: 2,
  },
  whatsappLabel: {
    color: '#22C55E',
  },
})
