/**
 * WhatsApp Integration Utilities
 * Handles phone number formatting and WhatsApp URL generation
 */

/**
 * Format phone number for WhatsApp
 * Removes spaces, dashes, parentheses and ensures proper format
 * 
 * @param phone - Raw phone number from database
 * @param defaultCountryCode - Default country code to add if missing (default: '91' for India)
 * @returns Formatted phone number suitable for WhatsApp URL
 * 
 * Examples:
 * - "98765 43210" -> "919876543210"
 * - "+91-9876543210" -> "919876543210"
 * - "9876543210" -> "919876543210"
 */
export const formatPhoneForWhatsApp = (
  phone: string,
  defaultCountryCode: string = '91'
): string => {
  if (!phone) return '';

  // Remove all non-digit characters (spaces, dashes, parentheses, etc.)
  let cleaned = phone.replace(/\D/g, '');

  // If number doesn't start with country code, add default
  if (!cleaned.startsWith(defaultCountryCode)) {
    cleaned = defaultCountryCode + cleaned;
  }

  return cleaned;
};

/**
 * Validate if phone number is in valid format
 * 
 * @param phone - Phone number to validate
 * @returns true if valid phone number (10-15 digits)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  // Valid phone numbers are typically 10-15 digits
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Generate WhatsApp message template for claiming items
 * 
 * @param itemTitle - Title of the item being claimed
 * @param claimantName - Name of the person claiming
 * @param claimantPhone - Phone number of claimant
 * @param customMessage - Custom message from claimant
 * @returns Formatted message string
 */
export const generateClaimMessage = (
  itemTitle: string,
  claimantName: string,
  claimantPhone: string,
  customMessage: string
): string => {
  return `Hello! I believe the item "${itemTitle}" listed on GFinder is mine.

*My Details:*
Name: ${claimantName}
Phone: ${claimantPhone}

*Message:*
${customMessage}

Please let me know how we can verify ownership and arrange return.

Thank you!`;
};

/**
 * Generate WhatsApp URL with pre-filled message
 * 
 * @param phoneNumber - Recipient's phone number (already formatted)
 * @param message - Message to pre-fill
 * @returns Complete WhatsApp URL
 * 
 * Format: https://wa.me/<phone>?text=<encoded_message>
 */
export const generateWhatsAppURL = (
  phoneNumber: string,
  message: string
): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Open WhatsApp with pre-filled message
 * 
 * @param phoneNumber - Raw phone number from database
 * @param itemTitle - Title of the item
 * @param claimantName - Name of claimant
 * @param claimantPhone - Phone of claimant
 * @param customMessage - Custom message
 * @param countryCode - Country code (default: '91')
 * @returns Object with success status and optional error message
 */
export const openWhatsAppChat = (
  phoneNumber: string,
  itemTitle: string,
  claimantName: string,
  claimantPhone: string,
  customMessage: string,
  countryCode: string = '91'
): { success: boolean; error?: string } => {
  // Validate input
  if (!isValidPhoneNumber(phoneNumber)) {
    return {
      success: false,
      error: 'Item owner phone number is not available or invalid',
    };
  }

  if (!claimantName.trim()) {
    return {
      success: false,
      error: 'Please enter your name',
    };
  }

  if (!claimantPhone.trim() || !isValidPhoneNumber(claimantPhone)) {
    return {
      success: false,
      error: 'Please enter a valid phone number',
    };
  }

  if (!customMessage.trim()) {
    return {
      success: false,
      error: 'Please enter a message',
    };
  }

  // Format phone number
  const formattedPhone = formatPhoneForWhatsApp(phoneNumber, countryCode);

  // Generate message
  const message = generateClaimMessage(
    itemTitle,
    claimantName,
    claimantPhone,
    customMessage
  );

  // Generate WhatsApp URL
  const whatsappURL = generateWhatsAppURL(formattedPhone, message);

  // Open WhatsApp in new tab
  window.open(whatsappURL, '_blank');

  return { success: true };
};
