import { notFound } from "next/navigation";

const posts: Record<string, { title: string; excerpt: string; body: string[] }> = {
  "blinkit-vs-zepto-bengaluru": {
    title: "Blinkit vs Zepto in Bengaluru: who wins on real checkout cost?",
    excerpt: "A fee-aware comparison of Bengaluru baskets across top quick-commerce apps.",
    body: [
      "Shelf prices only tell part of the story. In Bengaluru, delivery and platform fees frequently change the cheapest option once you reach checkout.",
      "SmartBasket tracks the true payable amount and finds that mixed-platform carts often beat single-platform convenience for medium-sized orders."
    ]
  }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) notFound();

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">Blog</div>
        <h1 className="mt-4 text-5xl font-black text-surface-900">{post.title}</h1>
        <p className="mt-6 text-lg text-slate-600">{post.excerpt}</p>
        <div className="mt-10 space-y-6 text-slate-700">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
