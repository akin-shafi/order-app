// components/Ticker.tsx

export default function Ticker() {
  return (
    <div className="bg-[#f15736] py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {Array(3)
          .fill("THE MORE IT TELLS YOU, THE LESS YOU KNOW")
          .map((text, i) => (
            <span
              key={i}
              className="text-white mx-4 uppercase text-sm font-medium"
            >
              {text}
            </span>
          ))}
      </div>
    </div>
  );
}
