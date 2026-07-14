type Props = {
  label: string; // 英字ラベル (例: "Featured Courses")
  title?: string; // 日本語タイトル
  className?: string;
};

export default function SectionHeading({ label, title, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="label-en">{label}</p>
      {title && (
        <h2 className="mt-3 text-2xl font-medium leading-snug md:text-3xl">
          {title}
        </h2>
      )}
    </div>
  );
}
