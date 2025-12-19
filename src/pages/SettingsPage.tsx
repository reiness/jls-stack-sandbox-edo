import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { settingsSchema, type SettingsFormValues } from "@/schemas/settingsSchema"
import { PageHeader } from "@/components/common/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { InlineAlert } from "@/components/common/InlineAlert"

export function SettingsPage() {
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: "Edo",
      role: "admin",
      bio: "Learning the JLS Stack.",
      notifications: true,
    },
  })

  async function onSubmit(data: SettingsFormValues) {
    // Clear previous errors
    form.clearErrors("root")

    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate error condition (Deterministic)
    if (data.displayName.toLowerCase().includes("error")) {
      form.setError("root", {
        type: "server",
        message: "This display name is not allowed (Simulated API Error).",
      })
      return
    }

    console.log("Form submitted:", data)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and preferences using the Field-first approach."
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Personal Info */}
          <div className="lg:col-span-2 space-y-8">
            <SectionCard title="Personal Information" description="How others see you in the sandbox.">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Display Name */}
                  <Field>
                    <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                    <FieldContent>
                      <Input 
                        id="displayName" 
                        {...form.register("displayName")} 
                        aria-invalid={!!form.formState.errors.displayName}
                      />
                      <FieldDescription>
                        Your public handle. Minimum 2 characters.
                      </FieldDescription>
                      <FieldError errors={[form.formState.errors.displayName]} />
                    </FieldContent>
                  </Field>

                  {/* Role - Using Controller for Select */}
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FieldDescription>
                        Determines your access level.
                      </FieldDescription>
                      <FieldError errors={[form.formState.errors.role]} />
                    </FieldContent>
                  </Field>
                </div>

                {/* Bio */}
                <Field>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <FieldContent>
                    <Textarea 
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      {...form.register("bio")}
                    />
                    <FieldDescription>
                      Brief description for your profile (max 160 chars).
                    </FieldDescription>
                    <FieldError errors={[form.formState.errors.bio]} />
                  </FieldContent>
                </Field>
              </FieldGroup>
            </SectionCard>
          </div>

          {/* Side Column: Preferences */}
          <div className="lg:col-span-1 space-y-8">
            <SectionCard title="Preferences" description="Control your app experience.">
              <FieldGroup>
                {/* Notifications - Using Controller for Switch */}
                <Field orientation="horizontal">
                  <FieldLabel htmlFor="notifications" className="cursor-pointer">
                    Push Notifications
                  </FieldLabel>
                  <FieldContent className="flex flex-row items-center justify-between">
                    <Controller
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <Switch
                          id="notifications"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </FieldContent>
                </Field>
                {/* Note: horizontal orientation puts label and content side-by-side */}
              </FieldGroup>
            </SectionCard>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-border/10">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            className="rounded-lg border-2"
            disabled={form.formState.isSubmitting}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="rounded-lg border-2 border-border shadow-hard transition-all hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none min-w-[120px]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      {/* Success State */}
      {form.formState.isSubmitSuccessful && !form.formState.errors.root && (
        <InlineAlert 
          tone="success" 
          title="Changes Saved" 
          message="Your settings have been updated successfully." 
        />
      )}

      {/* Error State */}
      {form.formState.errors.root && (
        <InlineAlert 
          tone="danger" 
          title="Submission Failed" 
          message={form.formState.errors.root.message || "An unexpected error occurred."}
        />
      )}
    </div>
  )
}
