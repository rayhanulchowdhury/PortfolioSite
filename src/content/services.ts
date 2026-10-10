/**
 * The three services. Each card links through to its portfolio section and to
 * the enquiry form with the matching service pre-selected.
 *
 * `enquiryValue` must match one of the options in `serviceOptions` below.
 */

export type ServiceId = 'video-editing' | 'photography' | 'videography'

export interface Service {
  id: ServiceId
  icon: 'edit' | 'camera' | 'film'
  title: string
  description: string
  categories: string[]
  /** Section id this card links to, e.g. '#video-editing'. */
  portfolioHref: string
  /** Value written into the enquiry form's service dropdown. */
  enquiryValue: string
}

export const services: Service[] = [
  {
    id: 'video-editing',
    icon: 'edit',
    title: 'Video Editing',
    description:
      'Professional editing that transforms raw footage into polished, engaging content tailored to your vision and platform.',
    categories: [
      'YouTube videos',
      'Short-form content and Reels',
      'Commercials and advertisements',
      'Brand films',
      'Event highlights',
      'Cinematic edits',
      'Social media content',
    ],
    portfolioHref: '#video-editing',
    enquiryValue: 'Video Editing',
  },
  {
    id: 'photography',
    icon: 'camera',
    title: 'Photography',
    description:
      'High-quality photography that captures people, products, brands and moments with creativity and purpose.',
    categories: [
      'Product photography',
      'Brand photography',
      'Portraits',
      'Lifestyle photography',
      'Events',
      'Commercial photography',
    ],
    portfolioHref: '#photography',
    enquiryValue: 'Photography',
  },
  {
    id: 'videography',
    icon: 'film',
    title: 'Videography',
    description:
      'Cinematic video production, from capturing the footage to creating compelling visual stories for brands, businesses and events.',
    categories: [
      'Brand films',
      'Promotional videos',
      'Events',
      'Interviews',
      'Commercial shoots',
      'Lifestyle films',
    ],
    portfolioHref: '#videography',
    enquiryValue: 'Videography',
  },
]

/** Options for the enquiry form's "Service required" dropdown. */
export const serviceOptions = [
  'Video Editing',
  'Photography',
  'Videography',
  'Multiple Services',
  'Not Sure Yet',
]
