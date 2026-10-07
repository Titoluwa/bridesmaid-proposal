import { Fragment } from 'react'

/**
 * Renders letter copy with a tiny subset of markdown:
 *   **bold**  and  *italic*
 */
export function RichText({ text }: Readonly<{ text: string }>) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean)
  let partIndex = 0

  return (
    <>
      {parts.map((part) => {
        partIndex += 1
        const key = `rt-token-${partIndex}`
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={key}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={key}>{part.slice(1, -1)}</em>
        }
        return <Fragment key={key}>{part}</Fragment>
      })}
    </>
  )
}
