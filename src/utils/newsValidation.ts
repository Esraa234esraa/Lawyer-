/**
 * News Validation Utilities
 * Centralized validation functions for news data
 */

import { News, NewsCreateInput, NewsUpdateInput, ValidationResult } from '@/types/news'

// ============================================================================
// Validation Rules
// ============================================================================

const VALIDATION_RULES = {
  name: {
    minLength: 3,
    maxLength: 200,
  },
  description: {
    minLength: 10,
    maxLength: 2000,
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  actionDate: {
    minDate: new Date(2000, 0, 1),
    maxDate: new Date(2050, 11, 31),
  },
}

// ============================================================================
// Individual Field Validators
// ============================================================================

/**
 * Validate news name
 */
export const validateName = (name: string | undefined): string | null => {
  if (!name) {
    return 'اسم الخبر مطلوب'
  }

  const trimmed = name.trim()

  if (trimmed.length < VALIDATION_RULES.name.minLength) {
    return `اسم الخبر يجب أن يكون على الأقل ${VALIDATION_RULES.name.minLength} أحرف`
  }

  if (trimmed.length > VALIDATION_RULES.name.maxLength) {
    return `اسم الخبر يجب ألا يتجاوز ${VALIDATION_RULES.name.maxLength} حرف`
  }

  return null
}

/**
 * Validate news description
 */
export const validateDescription = (description: string | undefined): string | null => {
  if (!description) {
    return 'وصف الخبر مطلوب'
  }

  const trimmed = description.trim()

  if (trimmed.length < VALIDATION_RULES.description.minLength) {
    return `وصف الخبر يجب أن يكون على الأقل ${VALIDATION_RULES.description.minLength} أحرف`
  }

  if (trimmed.length > VALIDATION_RULES.description.maxLength) {
    return `وصف الخبر يجب ألا يتجاوز ${VALIDATION_RULES.description.maxLength} حرف`
  }

  return null
}

/**
 * Validate news image
 */
export const validateImage = (image: File | undefined | null, isRequired = true): string | null => {
  if (!image) {
    return isRequired ? 'صورة الخبر مطلوبة' : null
  }

  if (!(image instanceof File)) {
    return 'الملف المرفوع غير صالح'
  }

  if (image.size > VALIDATION_RULES.image.maxSize) {
    return `حجم الصورة يجب ألا يتجاوز ${VALIDATION_RULES.image.maxSize / 1024 / 1024}MB`
  }

  if (!VALIDATION_RULES.image.allowedTypes.includes(image.type)) {
    return `صيغة الصورة غير مدعومة. الصيغ المدعومة: ${VALIDATION_RULES.image.allowedTypes.join(', ')}`
  }

  return null
}

/**
 * Validate action date
 */
export const validateActionDate = (date: string | Date | undefined): string | null => {
  if (!date) {
    return 'تاريخ الحدث مطلوب'
  }

  try {
    const dateObj = date instanceof Date ? date : new Date(date)

    if (isNaN(dateObj.getTime())) {
      return 'التاريخ غير صالح'
    }

    if (dateObj < VALIDATION_RULES.actionDate.minDate) {
      return `التاريخ يجب ألا يكون قبل ${VALIDATION_RULES.actionDate.minDate.getFullYear()}`
    }

    if (dateObj > VALIDATION_RULES.actionDate.maxDate) {
      return `التاريخ يجب ألا يكون بعد ${VALIDATION_RULES.actionDate.maxDate.getFullYear()}`
    }

    return null
  } catch {
    return 'التاريخ غير صالح'
  }
}

// ============================================================================
// Composite Validators
// ============================================================================

/**
 * Validate news creation input
 */
export const validateNewsCreateInput = (input: NewsCreateInput): ValidationResult => {
  const errors: Record<string, string> = {}

  const nameError = validateName(input.name)
  if (nameError) errors.name = nameError

  const descriptionError = validateDescription(input.description)
  if (descriptionError) errors.description = descriptionError

  const imageError = validateImage(input.image, true)
  if (imageError) errors.image = imageError

  const dateError = validateActionDate(input.actionDate)
  if (dateError) errors.actionDate = dateError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate news update input
 */
export const validateNewsUpdateInput = (input: NewsUpdateInput): ValidationResult => {
  const errors: Record<string, string> = {}

  const nameError = validateName(input.name)
  if (nameError) errors.name = nameError

  const descriptionError = validateDescription(input.description)
  if (descriptionError) errors.description = descriptionError

  // Image is optional on update
  const imageError = validateImage(input.image, false)
  if (imageError) errors.image = imageError

  const dateError = validateActionDate(input.actionDate)
  if (dateError) errors.actionDate = dateError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Validate single news item
 */
export const validateNews = (news: News): ValidationResult => {
  const errors: Record<string, string> = {}

  const nameError = validateName(news.name)
  if (nameError) errors.name = nameError

  const descriptionError = validateDescription(news.description)
  if (descriptionError) errors.description = descriptionError

  const dateError = validateActionDate(news.actionDate)
  if (dateError) errors.actionDate = dateError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// ============================================================================
// Export validation rules for UI usage
// ============================================================================

export const newsValidationRules = {
  name: VALIDATION_RULES.name,
  description: VALIDATION_RULES.description,
  image: VALIDATION_RULES.image,
  actionDate: VALIDATION_RULES.actionDate,
}
