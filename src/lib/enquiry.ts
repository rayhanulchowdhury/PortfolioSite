/**
 * Enquiry form validation and submission.
 *
 * The form only ever reports success when a configured provider genuinely
 * accepted the submission. With no provider configured it says so plainly
 * instead of pretending the message was sent.
 */

export interface EnquiryValues {
  name: string
  email: string
  company: string
  service: string
  projectType: string
  budget: string
  timeline: string
  message: string
}

export type EnquiryErrors = Partial<Record<keyof EnquiryValues, string>>

export const emptyEnquiry: EnquiryValues = {
  name: '',
  email: '',
  company: '',
  service: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
}

const ENDPOINT = (import.meta.env.VITE_ENQUIRY_ENDPOINT ?? '').trim()
const ACCESS_KEY = (import.meta.env.VITE_ENQUIRY_ACCESS_KEY ?? '').trim()

/** True when a submission provider has been configured in `.env`. */
export const enquiryConfigured = ENDPOINT.length > 0

// Deliberately permissive: catches typos like a missing @ or domain without
// rejecting unusual but valid addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Please enter your full name.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.service) {
    errors.service = 'Please choose the service you need.'
  }

  const message = values.message.trim()
  if (!message) {
    errors.message = 'Please tell us a little about your project.'
  } else if (message.length < 20) {
    errors.message = 'Please add a little more detail (at least 20 characters).'
  }

  return errors
}

export type SubmitResult =
  | { status: 'success' }
  | { status: 'unconfigured' }
  | { status: 'error'; message: string }

export async function submitEnquiry(values: EnquiryValues): Promise<SubmitResult> {
  if (!enquiryConfigured) return { status: 'unconfigured' }

  const payload: Record<string, string> = {
    name: values.name.trim(),
    email: values.email.trim(),
    company: values.company.trim(),
    service: values.service,
    projectType: values.projectType.trim(),
    budget: values.budget,
    timeline: values.timeline,
    message: values.message.trim(),
    subject: `New project enquiry — ${values.service}`,
  }

  // Web3Forms requires its public access key inside the request body.
  if (ACCESS_KEY) payload.access_key = ACCESS_KEY

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return { status: 'error', message: await describeFailure(response) }
    }

    // Some providers return HTTP 200 with a failure flag in the body.
    const body = await response.clone().json().catch(() => null)
    if (body && typeof body === 'object' && 'success' in body && body.success === false) {
      const message = 'message' in body && typeof body.message === 'string' ? body.message : ''
      return { status: 'error', message: message || 'The form provider rejected the submission.' }
    }

    return { status: 'success' }
  } catch {
    return {
      status: 'error',
      message: 'Could not reach the server. Please check your connection and try again.',
    }
  }
}

async function describeFailure(response: Response): Promise<string> {
  const body = await response.json().catch(() => null)

  if (body && typeof body === 'object') {
    if ('message' in body && typeof body.message === 'string') return body.message
    // Formspree returns an `errors` array.
    if ('errors' in body && Array.isArray(body.errors)) {
      const first = body.errors[0]
      if (first && typeof first.message === 'string') return first.message
    }
  }

  return `Submission failed (error ${response.status}). Please try again or email us directly.`
}

/**
 * Builds a mailto: link pre-filled with the enquiry, used as a fallback when
 * no provider is configured. Returns null when no contact email is set.
 */
export function buildMailto(values: EnquiryValues, to: string): string | null {
  if (!to) return null

  const lines = [
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    values.company.trim() && `Company / brand: ${values.company.trim()}`,
    `Service required: ${values.service}`,
    values.projectType.trim() && `Project type: ${values.projectType.trim()}`,
    values.budget && `Estimated budget: ${values.budget}`,
    values.timeline && `Preferred timeline: ${values.timeline}`,
    '',
    'Project description:',
    values.message.trim(),
  ].filter(Boolean)

  const subject = encodeURIComponent(`Project enquiry — ${values.service}`)
  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:${to}?subject=${subject}&body=${body}`
}
