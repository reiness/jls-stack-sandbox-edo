import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toolSchema, type ToolFormValues } from "@/schemas/toolSchema"
import { PageHeader } from "@/components/common/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

export function CreateToolPage() {
  const form = useForm<ToolFormValues>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: "",
      category: "",
      visibility: "internal",
      description: "",
      tags: "",
    },
  })

  async function onSubmit(data: ToolFormValues) {
    form.clearErrors("root")
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validation: Custom error simulation
    if (data.name.toLowerCase().includes("bug")) {
      form.setError("name", {
        type: "manual",
        message: "Tool name cannot contain 'bug' (simulated field error).",
      })
      return
    }

    // Form-level error simulation (Random 10% failure)
    // Removed Math.random call to ensure purity, replaced with deterministic check
    if (data.description.includes("fail")) {
       form.setError("root", {
         type: "server",
         message: "Simulation: The server rejected this description.",
       })
       return
    }

    console.log("Tool Created:", data)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        title="Create New Tool"
        subtitle="Add a new utility to your JLS Stack workspace."
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Tool Details */}
          <div className="lg:col-span-2 space-y-8">
            <SectionCard title="Tool Details" description="Basic information about the tool.">
              <FieldGroup>
                {/* Tool Name */}
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Tool Name</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="e.g. Image Resizer"
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldDescription>
                          Unique name for the tool.
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <Controller
                    control={form.control}
                    name="category"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Category</FieldLabel>
                        <FieldContent>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="category" aria-invalid={fieldState.invalid}>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="productivity">Productivity</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                            </SelectContent>
                          </Select>
                          <FieldError errors={[fieldState.error]} />
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* Visibility */}
                  <Controller
                    control={form.control}
                    name="visibility"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Visibility</FieldLabel>
                        <FieldContent>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="internal">Internal (Team Only)</SelectItem>
                              <SelectItem value="public">Public (Everyone)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FieldDescription>
                            Who can access?
                          </FieldDescription>
                          <FieldError errors={[fieldState.error]} />
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </SectionCard>
          </div>

          {/* Side Column: Documentation */}
          <div className="lg:col-span-1 space-y-8">
            <SectionCard title="Documentation" description="Help others understand this tool.">
              <FieldGroup>
                {/* Short Description */}
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Short Description</FieldLabel>
                      <FieldContent>
                        <Textarea
                          {...field}
                          id={field.name}
                          placeholder="Describe what this tool does..."
                          className="resize-none"
                          rows={6}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldDescription>
                          Max 200 characters.
                        </FieldDescription>
                        <FieldError errors={[fieldState.error]} />
                      </FieldContent>
                    </Field>
                  )}
                />

                 {/* Tags (Optional) */}
                 <Controller
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Tags</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          id={field.name}
                          placeholder="react, generator, cli"
                        />
                        <FieldDescription>
                          Comma-separated (optional).
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  )}
                />
              </FieldGroup>
            </SectionCard>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-border/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting}
            className="rounded-lg border-2"
          >
             Reset
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="rounded-lg border-2 border-border shadow-hard transition-all hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none min-w-[120px]"
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Tool"}
          </Button>
        </div>
      </form>

      {/* Feedback Banners */}
      {form.formState.isSubmitSuccessful && !form.formState.errors.root && (
        <InlineAlert
          tone="success"
          title="Tool Created"
          message="Your new tool has been successfully registered."
        />
      )}

      {form.formState.errors.root && (
        <InlineAlert
          tone="danger"
          title="Submission Failed"
          message={form.formState.errors.root.message || "An error occurred."}
        />
      )}
    </div>
  )
}
