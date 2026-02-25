import { describe, it, expect } from 'vitest';
import {
  formatPhoneForWhatsApp,
  isValidPhoneNumber,
  generateClaimMessage,
  generateWhatsAppURL,
} from '@/lib/whatsapp';

describe('WhatsApp Utilities', () => {
  describe('formatPhoneForWhatsApp', () => {
    it('should add country code when missing', () => {
      expect(formatPhoneForWhatsApp('9876543210')).toBe('919876543210');
    });

    it('should remove spaces and dashes', () => {
      expect(formatPhoneForWhatsApp('98765 43210')).toBe('919876543210');
      expect(formatPhoneForWhatsApp('98765-43210')).toBe('919876543210');
    });

    it('should handle numbers with +91', () => {
      expect(formatPhoneForWhatsApp('+91-9876543210')).toBe('919876543210');
    });

    it('should not duplicate country code', () => {
      expect(formatPhoneForWhatsApp('919876543210')).toBe('919876543210');
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('9876543210')).toBe(true);
      expect(isValidPhoneNumber('98765 43210')).toBe(true);
      expect(isValidPhoneNumber('+91-9876543210')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('')).toBe(false);
      expect(isValidPhoneNumber('abc')).toBe(false);
    });
  });

  describe('generateClaimMessage', () => {
    it('should generate properly formatted message', () => {
      const message = generateClaimMessage(
        'iPhone 15',
        'Rahul',
        '9876543210',
        'I lost it near library'
      );

      expect(message).toContain('iPhone 15');
      expect(message).toContain('Rahul');
      expect(message).toContain('9876543210');
      expect(message).toContain('I lost it near library');
      expect(message).toContain('GFinder');
    });
  });

  describe('generateWhatsAppURL', () => {
    it('should generate valid WhatsApp URL', () => {
      const url = generateWhatsAppURL('919876543210', 'Hello World');
      expect(url).toBe('https://wa.me/919876543210?text=Hello%20World');
    });

    it('should properly encode special characters', () => {
      const url = generateWhatsAppURL('919876543210', 'Hello! How are you?');
      expect(url).toContain('https://wa.me/919876543210?text=');
      expect(url).toContain(encodeURIComponent('Hello! How are you?'));
    });
  });
});
