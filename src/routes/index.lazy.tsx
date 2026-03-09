import { createLazyFileRoute } from '@tanstack/react-router'

import { HomeBento } from '@/features/portfolio/components/home-bento'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return <HomeBento />
}