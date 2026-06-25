export default function SeoContent({ heading, paragraphs }) {
  if (!paragraphs?.length) return null;

  return (
    <section className="card p-6 md:p-8 mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">{heading}</h2>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
