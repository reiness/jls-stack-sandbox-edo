import { Button } from "@/components/ui/button"

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
        <div className="2xl:col-span-4 relative group overflow-hidden rounded-2xl border-2 border-border bg-card p-8 shadow-hard transition-all hover:shadow-hard-hover">
          <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="mb-9">
            <h3 className="text-2xl font-bold text-foreground">Welcome Back</h3>
            <p className="text-muted-foreground mt-1">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2.5">
              <label htmlFor="email_modern" className="text-sm font-semibold text-foreground">
                Email Address
              </label>
              <input
                id="email_modern"
                type="email"
                placeholder="you@domain.com"
                className="w-full rounded-lg border-2 border-border bg-input px-4 py-2.5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
              />
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label htmlFor="pass_modern" className="text-sm font-semibold text-foreground">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <input
                id="pass_modern"
                type="password"
                className="w-full rounded-lg border-2 border-border bg-input px-4 py-2.5 text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <Button className="w-full text-md py-6">
              Sign In
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <svg className="h-4 w-4" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                <svg className="h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Github
              </button>
            </div>
          </div>
        </div>

        {/* Floating Label Profile Config */}
        <div className="2xl:col-span-8 group relative rounded-2xl bg-card p-8 shadow-hard ring-1 ring-border border-2 border-border hover:shadow-hard-hover transition-all">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-foreground">Profile Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your public persona</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-linear-to-r from-purple-400 to-blue-400 p-0.5">
                    <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
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
                        className="peer block w-full rounded-lg border-2 border-border bg-transparent px-4 pb-2.5 pt-4 text-sm text-foreground focus:border-primary focus:outline-none"
                        placeholder=" "
                    />
                    <label 
                        htmlFor="floating_user" 
                        className="pointer-events-none absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary bg-card px-1"
                    >
                        Username
                    </label>
                </div>

                <div className="relative">
                    <textarea 
                        id="floating_bio" 
                        rows={3}
                        className="peer block w-full rounded-lg border-2 border-border bg-transparent px-4 pb-2.5 pt-4 text-sm text-foreground focus:border-primary focus:outline-none resize-none"
                        placeholder=" "
                    ></textarea>
                    <label 
                        htmlFor="floating_bio" 
                        className="pointer-events-none absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary bg-card px-1"
                    >
                        Bio
                    </label>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="flex-1 rounded-full border-2 border-border py-6 text-sm font-semibold hover:bg-muted">
                        Discard
                    </Button>
                    <Button className="flex-1 rounded-full py-6 text-sm font-semibold shadow-md">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
