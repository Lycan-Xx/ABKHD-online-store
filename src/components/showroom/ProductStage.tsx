import { useState } from 'react';
import { Play } from 'lucide-react';
import type { ShowroomProduct } from '../../lib/showroom';

/**
 * PDP image stage (SPEC §6.5) - left column. Mockup stage verbatim:
 * `rounded-3xl bg-secondary/50` + radial spotlight, floating image
 * (CSS float loop, disabled under reduced motion), thumbnail rail
 * from real product images. ABKHD extension: a `play` chip toggles the
 * product video into the stage in place of the image.
 */
export function ProductStage({ product }: { product: ShowroomProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const images = product.images.length ? product.images : [product.image];

  return (
    <div className="animate-rise relative">
      <div className="relative overflow-hidden rounded-3xl bg-secondary/50 p-6 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 35%, oklch(1 0 0 / 0.7), transparent 70%)',
          }}
        />

        {showVideo && product.video ? (
          <video
            src={product.video}
            poster={product.videoThumbnail || product.image}
            controls
            autoPlay
            playsInline
            className="relative mx-auto aspect-square w-full max-w-[520px] rounded-2xl bg-background object-cover"
          />
        ) : (
          <img
            src={images[activeImage] || product.image}
            alt={product.name}
            width={1200}
            height={1200}
            className={`animate-float relative mx-auto aspect-square w-full max-w-[520px] rounded-2xl object-cover`}
          />
        )}

        {/* Video toggle chip - ABKHD-only extension, mockup chip treatment */}
        {product.video && (
          <button
            onClick={() => setShowVideo((v) => !v)}
            className={`absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-[11px] font-medium backdrop-blur transition ${
              showVideo
                ? 'bg-foreground text-background'
                : 'bg-background/90 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Play className="h-3 w-3" /> {showVideo ? 'Photos' : 'Video'}
          </button>
        )}
      </div>

      {/* Thumbnail rail - real images, hidden when there's less than 2 */}
      {images.length > 1 && (
        <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              onClick={() => {
                setActiveImage(i);
                setShowVideo(false);
              }}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border transition ${
                !showVideo && i === activeImage
                  ? 'border-foreground'
                  : 'border-border hover:border-foreground/40'
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
