import Image from 'next/image'
import { site } from '@/lib/site'
import { loginAdminAction } from '@/app/admin/actions'

type Props = {
  configured: boolean
  title?: string
  description?: string
  buttonText?: string
}

export function AdminLoginForm({
  configured,
  title = 'Private Admin',
  description = 'Enter the admin password to view responses and assigned bridesmaid colors.',
  buttonText = 'Enter Dashboard',
}: Readonly<Props>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8 text-center shadow-lg">
        <Image
          src={site.logo}
          alt={site.couple}
          width={52}
          height={52}
          priority
          className="mx-auto h-12 w-12 object-contain drop-shadow-xs"
        />
        <h1 className="mt-3 font-display text-2xl font-light text-ink">{title}</h1>
        <p className="mt-2 text-xs text-muted">
          {description}
        </p>

        <form action={loginAdminAction} className="mt-6 flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="password" className="eyebrow block">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter password..."
              className="mt-2 w-full rounded-xl border border-line bg-ivory/60 px-4 py-3 text-sm text-ink placeholder-muted/60 focus:border-ink focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="btn-primary mt-2 w-full"
          >
            {buttonText}
          </button>
        </form>

        {!configured && (
          <p className="mt-6 text-[0.7rem] text-muted italic">
            Tip: Set the <code className="font-mono text-ink">ADMIN_PASSWORD</code> environment variable in production.
          </p>
        )}
      </div>
    </div>
  )
}
