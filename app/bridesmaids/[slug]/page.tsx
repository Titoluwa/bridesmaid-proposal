import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { bridesmaidSlugs, getBridesmaid } from '@/lib/bridesmaids'
import { site } from '@/lib/site'
import { getStore } from '@/lib/store'
import { BridesmaidExperience } from '@/components/proposal/BridesmaidExperience'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return bridesmaidSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const bridesmaid = getBridesmaid(slug)
  if (!bridesmaid) return { title: 'Letter Not Found' }

  return {
    title: `A Letter for ${bridesmaid.shortName}`,
    description: `A private letter from your bride-to-be. 🤍`,
    openGraph: {
      title: `A Letter for ${bridesmaid.shortName}`,
      description: `A private letter from your bride-to-be. 🤍`,
      siteName: site.couple,
    },
  }
}

export default async function BridesmaidPage({ params }: Props) {
  const { slug } = await params
  const bridesmaid = getBridesmaid(slug)

  if (!bridesmaid) {
    notFound()
  }

  // Retrieve any existing record so return visitors have their color and status
  const store = getStore()
  const initialRecord = await store.get(bridesmaid.slug)

  return (
    <BridesmaidExperience
      bridesmaid={bridesmaid}
      initialRecord={initialRecord}
    />
  )
}
