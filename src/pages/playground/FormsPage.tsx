export function FormsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent w-fit">
          Forms Playground
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
          Experimental form layouts showcasing custom Tailwind styling.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 2xl:grid-cols-12">
        {/* Modern Gradient Login */}
        <div className="2xl:col-span-4 relative group overflow-hidden rounded-2xl border bg-white dark:bg-slate-950 p-8 shadow-xl transition-all hover:shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="mb-9">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2.5">
              <label htmlFor="email_modern" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                id="email_modern"
                type="email"
                placeholder="you@domain.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label htmlFor="pass_modern" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                  Forgot password?
                </a>
              </div>
              <input
                id="pass_modern"
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-md font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:shadow-blue-500/30 active:scale-[0.98]">
              Sign In
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 dark:bg-slate-950">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                <svg className="h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                <svg className="h-4 w-4 text-slate-900 dark:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Github
              </button>
            </div>
          </div>
        </div>

        {/* Floating Label Profile Config */}
        <div className="2xl:col-span-8 group relative rounded-2xl bg-white dark:bg-slate-950 p-8 shadow-sm ring-1 ring-slate-900/5 transition-all hover:ring-slate-900/10 dark:ring-white/10 dark:hover:ring-white/20">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h3>
                    <p className="text-sm text-slate-500">Manage your public persona</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-linear-to-r from-purple-400 to-blue-400 p-0.5">
                    <div className="h-full w-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-purple-400 to-blue-400">JS</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                 {/* Floating Label Logic via peer */}
                <div className="relative">
                    <input 
                        type="text" 
                        id="floating_user" 
                        className="peer block w-full rounded-lg border-2 border-slate-200 bg-transparent px-4 pb-2.5 pt-4 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-indigo-500"
                        placeholder=" "
                    />
                    <label 
                        htmlFor="floating_user" 
                        className="pointer-events-none absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 dark:text-slate-400 dark:peer-focus:text-indigo-500 bg-white dark:bg-slate-950 px-1"
                    >
                        Username
                    </label>
                </div>

                <div className="relative">
                    <textarea 
                        id="floating_bio" 
                        rows={3}
                        className="peer block w-full rounded-lg border-2 border-slate-200 bg-transparent px-4 pb-2.5 pt-4 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none dark:border-slate-800 dark:text-white dark:focus:border-indigo-500 resize-none"
                        placeholder=" "
                    ></textarea>
                    <label 
                        htmlFor="floating_bio" 
                        className="pointer-events-none absolute left-4 top-2 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-indigo-600 dark:text-slate-400 dark:peer-focus:text-indigo-500 bg-white dark:bg-slate-950 px-1"
                    >
                        Bio
                    </label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                        Discard
                    </button>
                    <button className="flex-1 rounded-full bg-slate-900 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
