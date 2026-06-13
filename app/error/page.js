import Link from "next/link";

export default async function ErrorPage(props) {
  const searchParams = await props.searchParams;
  const errorDescription = searchParams?.error_description || "Sorry, there was an error during authentication.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Authentication Error
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {errorDescription}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium h-11 px-6 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 cursor-pointer w-full"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}