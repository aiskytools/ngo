export default function SectionHeading({ label, title, description, light = false }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      {label && (
        <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 px-4 py-1.5 rounded-full ${
          light
            ? "bg-emerald-900/30 text-emerald-300"
            : "bg-emerald-50 text-emerald-700"
        }`}>
          {label}
        </span>
      )}
      <h2 className={`font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
        light ? "text-white" : "text-gray-900"
      }`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg ${light ? "text-gray-300" : "text-gray-500"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
