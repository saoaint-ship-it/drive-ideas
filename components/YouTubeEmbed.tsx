type Props = {
  youtubeId: string;
  title: string;
};

export default function YouTubeEmbed({ youtubeId, title }: Props) {
  return (
    <div className="relative aspect-video w-full bg-surface">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
      />
    </div>
  );
}
