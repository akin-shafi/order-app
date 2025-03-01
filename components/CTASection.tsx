// components/CTASection.tsx
export default function CTASection() {
  return (
    <section className="bg-[#210603] py-24 px-6 md:px-12 pt-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Make we help you deliver your food.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-[#d9d9d9] h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    </section>
  );
}
