import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/ui/card'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            <span className="text-indigo-blue">Indigo</span>{' '}
            <span className="text-earthy-brown">Roots</span>{' '}
            <span className="text-leaf-green">Vibe</span>
          </h1>
          <p className="text-brand-gray text-lg">Component Test Page</p>
        </header>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center space-y-2">
              <p className="font-medium">Indigo Blue</p>
              <p className="text-xs text-brand-gray">#36A9E1</p>
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Earthy Brown</p>
              <p className="text-xs text-brand-gray">#8B6B4C</p>
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Brand Gray</p>
              <p className="text-xs text-brand-gray">#6C6C6C</p>
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Leaf Green</p>
              <p className="text-xs text-brand-gray">#6BBE45</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardTitle>Welcome Card</CardTitle>
              <CardContent>
                This is a sample card component with our brand styling. It has a
                subtle border and proper spacing.
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="text-indigo-blue">
                Featured Content
              </CardTitle>
              <CardContent>
                Cards can have colored titles using our brand colors. This one
                uses the indigo blue from our palette.
              </CardContent>
            </Card>

            <Card>
              <CardTitle className="text-earthy-brown">Blog Post</CardTitle>
              <CardContent>
                Perfect for displaying blog posts, articles, or any content that
                needs to be highlighted on the page.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-semibold">Heading 2</h2>
            <h3 className="text-2xl font-medium">Heading 3</h3>
            <p className="text-base">
              This is regular paragraph text. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
            <p className="text-brand-gray">
              This is muted text using our brand gray color. Perfect for
              secondary information or descriptions.
            </p>
          </div>
        </section>

        {/* Dark Mode Info */}
        <section>
          <Card>
            <CardTitle>Dark Mode</CardTitle>
            <CardContent>
              The theme automatically switches between light and dark modes
              based on your system preferences. Try changing your system theme
              to see the difference!
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
