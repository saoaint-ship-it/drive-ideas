import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import SpecMeter from "@/components/SpecMeter";
import ClosureBadge from "@/components/ClosureBadge";
import type { Course } from "@/types/course";

type Props = {
  course: Course;
  large?: boolean;
};

// コース一覧・関連コース・トップで使う共通カード
export default function CourseCard({ course, large = false }: Props) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block focus-visible:outline-2"
    >
      <div
        className={`img-hover relative ${large ? "aspect-[4/3]" : "aspect-[3/2]"}`}
      >
        <SmartImage
          src={course.heroImage}
          alt={course.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        {course.closure && (
          <div className="absolute left-3 top-3">
            <ClosureBadge closure={course.closure} />
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="label-en">{course.prefectures.join(" / ")}</p>
        <h3
          className={`mt-1.5 font-medium leading-snug ${
            large ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {course.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted">
          {course.catchcopy}
        </p>
      </div>

      <div className="mt-4">
        <SpecMeter course={course} compact />
      </div>
    </Link>
  );
}
