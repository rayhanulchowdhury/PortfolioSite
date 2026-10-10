import { useEffect, useId, useRef, useState } from 'react'
import { Section } from './Section'
import { BookCallButton } from './BookCallButton'
import { serviceOptions } from '@/content/services'
import { site } from '@/content/site'
import { schedulingEnabled } from '@/lib/scheduling'
import {
  buildMailto,
  emptyEnquiry,
  enquiryConfigured,
  submitEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from '@/lib/enquiry'

const budgetOptions = [
  'Under £500',
  '£500 – £1,000',
  '£1,000 – £2,500',
  '£2,500 – £5,000',
  '£5,000+',
  'Not sure yet',
]

const timelineOptions = [
  'As soon as possible',
  'Within 2 weeks',
  'Within 1 month',
  '1 – 3 months',
  'Flexible',
]

interface ContactProps {
  /** Service pre-selected by a "Enquire About This Service" card click. */
  preselectedService: string
  onServiceConsumed: () => void
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success' }
  | { kind: 'unconfigured' }
  | { kind: 'error'; message: string }

export function Contact({ preselectedService, onServiceConsumed }: ContactProps) {
  const [values, setValues] = useState<EnquiryValues>(emptyEnquiry)
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const statusRef = useRef<HTMLDivElement>(null)
  const formId = useId()

  // Apply the service chosen on a service card, then clear the request so a
  // later manual change is not overwritten.
  useEffect(() => {
    if (!preselectedService) return
    setValues((current) => ({ ...current, service: preselectedService }))
    setErrors((current) => ({ ...current, service: undefined }))
    onServiceConsumed()
  }, [preselectedService, onServiceConsumed])

  const update =
    (field: keyof EnquiryValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value } = event.target
      setValues((current) => ({ ...current, [field]: value }))
      // Clear a field's error as soon as the visitor starts correcting it.
      setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
    }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const found = validateEnquiry(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      // Send focus to the first invalid field.
      const firstInvalid = Object.keys(found)[0]
      document.getElementById(`${formId}-${firstInvalid}`)?.focus()
      setStatus({ kind: 'idle' })
      return
    }

    setStatus({ kind: 'sending' })
    const result = await submitEnquiry(values)

    if (result.status === 'success') {
      setStatus({ kind: 'success' })
      setValues(emptyEnquiry)
    } else if (result.status === 'unconfigured') {
      setStatus({ kind: 'unconfigured' })
    } else {
      setStatus({ kind: 'error', message: result.message })
    }

    statusRef.current?.scrollIntoView({ block: 'nearest' })
  }

  const mailto = buildMailto(values, site.email)

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s Talk About Your Project"
      lead="Tell us a little about your project, the services you’re looking for and what you’d like to achieve. We’ll be in touch to discuss the next steps."
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <form onSubmit={handleSubmit} noValidate className="card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id={`${formId}-name`}
              label="Full name"
              required
              error={errors.name}
              value={values.name}
              onChange={update('name')}
              autoComplete="name"
              placeholder="Your name"
            />

            <Field
              id={`${formId}-email`}
              label="Email address"
              required
              type="email"
              error={errors.email}
              value={values.email}
              onChange={update('email')}
              autoComplete="email"
              placeholder="you@example.com"
            />

            <Field
              id={`${formId}-company`}
              label="Company or brand"
              value={values.company}
              onChange={update('company')}
              autoComplete="organization"
              placeholder="Optional"
            />

            <SelectField
              id={`${formId}-service`}
              label="Service required"
              required
              error={errors.service}
              value={values.service}
              onChange={update('service')}
              placeholder="Select a service"
              options={serviceOptions}
            />

            <Field
              id={`${formId}-projectType`}
              label="Project type"
              value={values.projectType}
              onChange={update('projectType')}
              placeholder="e.g. Brand film, product shoot"
            />

            <SelectField
              id={`${formId}-budget`}
              label="Estimated budget"
              value={values.budget}
              onChange={update('budget')}
              placeholder="Select a range"
              options={budgetOptions}
            />

            <div className="sm:col-span-2">
              <SelectField
                id={`${formId}-timeline`}
                label="Preferred timeline"
                value={values.timeline}
                onChange={update('timeline')}
                placeholder="Select a timeline"
                options={timelineOptions}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor={`${formId}-message`} required>
                Project description
              </Label>
              <textarea
                id={`${formId}-message`}
                rows={5}
                value={values.message}
                onChange={update('message')}
                required
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? `${formId}-message-error` : undefined}
                placeholder="Tell us about your project, what you’d like to achieve and anything else that would help."
                className={`field resize-y ${errors.message ? 'field-invalid' : ''}`}
              />
              <FieldError id={`${formId}-message-error`} message={errors.message} />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={status.kind === 'sending'} className="btn-primary">
              {status.kind === 'sending' ? 'Sending…' : 'Send Enquiry'}
            </button>
            <p className="text-xs leading-relaxed text-muted">
              Required fields are marked <span className="text-purple">*</span>
            </p>
          </div>

          {/* Submission status. Announced to screen readers when it changes. */}
          <div ref={statusRef} role="status" aria-live="polite" className="mt-5 empty:mt-0">
            {status.kind === 'success' && (
              <Notice tone="success">
                Thank you — your enquiry has been sent. We&rsquo;ll be in touch shortly.
              </Notice>
            )}

            {status.kind === 'error' && <Notice tone="error">{status.message}</Notice>}

            {status.kind === 'unconfigured' && (
              <Notice tone="warning">
                <strong className="font-semibold text-ink">
                  This form is not connected to a provider yet, so nothing was sent.
                </strong>{' '}
                Your details have not been submitted anywhere.
                {mailto ? (
                  <>
                    {' '}
                    <a href={mailto} className="font-semibold text-purple-soft underline">
                      Send it by email instead
                    </a>{' '}
                    — your answers are already filled in.
                  </>
                ) : (
                  <> See README.md for how to connect a form provider.</>
                )}
              </Notice>
            )}
          </div>
        </form>

        <aside className="space-y-5">
          <div className="card p-6">
            <h3 className="text-base font-bold tracking-tight">Prefer to talk it through?</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {schedulingEnabled
                ? 'Book a call at a time that suits you and we can discuss your project directly.'
                : 'Online booking is not set up yet — send an enquiry and we will arrange a time with you directly.'}
            </p>
            <BookCallButton className="mt-5 w-full" />
          </div>

          <div className="card p-6">
            <h3 className="text-base font-bold tracking-tight">Direct contact</h3>
            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="mt-3 block text-sm font-medium text-purple-soft transition-colors hover:text-purple"
              >
                {site.email}
              </a>
            ) : import.meta.env.DEV ? (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Add your email address in{' '}
                <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-ink">
                  src/content/site.ts
                </code>{' '}
                and it will appear here.
              </p>
            ) : null}
            {site.phone && <p className="mt-2 text-sm text-muted">{site.phone}</p>}
            {site.location && <p className="mt-2 text-sm text-muted">{site.location}</p>}
          </div>

          {import.meta.env.DEV && !enquiryConfigured && (
            <p className="text-xs leading-relaxed text-muted/80">
              Note for the site owner: set <code className="text-muted">VITE_ENQUIRY_ENDPOINT</code>{' '}
              in <code className="text-muted">.env</code> to start receiving submissions. See
              README.md.
            </p>
          )}
        </aside>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Form primitives                                                           */
/* -------------------------------------------------------------------------- */

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-xs font-semibold tracking-wide text-ink">
      {children}
      {required ? (
        <span className="ml-1 text-purple" aria-hidden>
          *
        </span>
      ) : (
        <span className="ml-1.5 font-normal text-muted">(optional)</span>
      )}
    </label>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-xs text-red-400">
      {message}
    </p>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
  error?: string
  placeholder?: string
  autoComplete?: string
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
  error,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field ${error ? 'field-invalid' : ''}`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[]
  placeholder: string
  required?: boolean
  error?: string
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: SelectFieldProps) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10 ${
          error ? 'field-invalid' : ''
        } ${value ? 'text-ink' : 'text-muted/70'}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23A3A3AE' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-surface text-ink">
            {option}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

function Notice({
  tone,
  children,
}: {
  tone: 'success' | 'error' | 'warning'
  children: React.ReactNode
}) {
  const tones = {
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
    error: 'border-red-500/40 bg-red-500/10 text-red-200',
    warning: 'border-purple/40 bg-purple/10 text-muted',
  }

  return (
    <div className={`rounded-lg border px-4 py-3.5 text-sm leading-relaxed ${tones[tone]}`}>
      {children}
    </div>
  )
}
