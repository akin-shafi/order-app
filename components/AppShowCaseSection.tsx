// components/AppShowCaseSection.tsx

export default function AppShowCaseSection() {
  return (
    <section className="py-12 px-6 md:px-12 bg-white border border-[#d9d9d9] mx-6 md:mx-12 rounded-lg relative -mb-16 z-10">
      <div className="grid md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col items-center">
            <div className="bg-[#eff3fd] w-24 h-24 rounded-lg mb-4"></div>
            <div className="h-2 bg-[#d9d9d9] w-24 rounded-full mb-2"></div>
            <div className="h-2 bg-[#d9d9d9] w-16 rounded-full"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
